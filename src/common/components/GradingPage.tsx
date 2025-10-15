import React, { useState, useRef } from 'react';
import {
  Container,
  Typography,
  Button,
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Alert,
  Chip,
  Grid,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Upload as UploadIcon,
  PlayArrow as PlayIcon,
  Download as DownloadIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import { executeAllTests } from '../utils/gradingExecutor';
import { convertYAMLToTrials, validateYAMLTestSuite } from '../utils/yamlConverter';
import type { SharedMachineState } from '../../types';

interface StudentSubmission {
  name: string;
  url: string;
}

interface TestCase {
  name: string;
  input: string;
  expected: string;
  startState?: string;
}

interface GradingResult {
  studentName: string;
  testResults: {
    testName: string;
    passed: boolean;
    actualOutput: string;
    expectedOutput: string;
    error?: string;
    steps?: number;
    machineRuleCount?: number;
    machineUniqueStates?: number;
  }[];
  totalPassed: number;
  totalFailed: number;
  loadError?: string;
}

interface GradingProgress {
  current: number;
  total: number;
  currentStudent: string;
  currentTest: string;
}

function GradingPage(): React.ReactElement {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [yamlFile, setYamlFile] = useState<File | null>(null);
  const csvFileInputRef = useRef<HTMLInputElement>(null);
  const yamlFileInputRef = useRef<HTMLInputElement>(null);
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [results, setResults] = useState<GradingResult[]>([]);
  const [isGrading, setIsGrading] = useState<boolean>(false);
  const [progress, setProgress] = useState<GradingProgress | null>(null);
  const [error, setError] = useState<string>('');

  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setCsvFile(file);
    setError('');

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        try {
          const data = results.data as any[];
          const parsed: StudentSubmission[] = data
            .filter(row => row.name && row.url)
            .map(row => ({
              name: row.name.trim(),
              url: row.url.trim(),
            }));
          
          setSubmissions(parsed);
        } catch (err) {
          setError('Failed to parse CSV file. Please ensure it has "name" and "url" columns.');
        }
      },
      error: (err) => {
        setError(`CSV parsing error: ${err.message}`);
      }
    });
  };

  const handleYamlUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setYamlFile(file);
    setError('');

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const yamlContent = e.target?.result as string;
        console.log('Raw YAML content:', yamlContent);
        
        // Validate YAML first
        const validation = validateYAMLTestSuite(yamlContent);
        if (!validation.valid) {
          setError(`Invalid YAML format: ${validation.errors.join(', ')}`);
          return;
        }
        
        // Use the shared YAML parser
        const trials = convertYAMLToTrials(yamlContent);
        
        // Convert TrialData to TestCase format for grading
        const tests: TestCase[] = trials.map(trial => ({
          name: trial.name,
          input: trial.startTape,
          expected: trial.expectedTape,
          startState: trial.startState, // Include start state
        }));
        
        console.log('Parsed test cases:', tests);
        setTestCases(tests);
      } catch (err) {
        setError(`Failed to parse YAML file: ${(err as Error).message}`);
      }
    };
    
    reader.readAsText(file);
  };

  const loadMachineFromUrl = async (url: string): Promise<any> => {
    // Extract ID from URL if it's a full URL, otherwise assume it's just an ID
    const id = url.includes('/') ? url.split('/').pop() : url;
    
    console.log(`Loading machine from URL: ${url}, extracted ID: ${id}`);
    
    const response = await fetch(`/api/state/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to load machine: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Loaded machine data:', data);
    console.log('Machine state:', data.state);
    console.log('Rules count:', data.state?.machine?.rules?.length || 0);
    
    return data.state;
  };

  const executeMachineTests = async (machineState: SharedMachineState, testCases: TestCase[]): Promise<any[]> => {
    try {
      const results = await executeAllTests(machineState, testCases);
      return results;
    } catch (error) {
      throw new Error(`Test execution failed: ${(error as Error).message}`);
    }
  };

  const runGrading = async () => {
    if (submissions.length === 0 || testCases.length === 0) {
      setError('Please upload both CSV file with submissions and YAML file with test cases.');
      return;
    }

    setIsGrading(true);
    setResults([]);
    setError('');
    
    const gradingResults: GradingResult[] = [];
    
    for (let i = 0; i < submissions.length; i++) {
      const submission = submissions[i];
      
      setProgress({
        current: i + 1,
        total: submissions.length,
        currentStudent: submission.name,
        currentTest: '',
      });

      try {
        // Load machine state
        const machineState = await loadMachineFromUrl(submission.url);
        
        const testResults = [];
        let totalPassed = 0;
        let totalFailed = 0;

        // Run all test cases for this machine
        setProgress(prev => prev ? { ...prev, currentTest: 'Running all tests...' } : null);
        
        const results = await executeMachineTests(machineState, testCases);
        
        // Process results
        for (let i = 0; i < testCases.length; i++) {
          const testCase = testCases[i];
          const result = results[i];

          testResults.push({
            testName: testCase.name,
            passed: result.passed,
            actualOutput: result.actualOutput,
            expectedOutput: result.expectedOutput,
            error: result.error,
            steps: result.steps,
            machineRuleCount: result.machineRuleCount,
            machineUniqueStates: result.machineUniqueStates,
          });

          if (result.passed) {
            totalPassed++;
          } else {
            totalFailed++;
          }
        }

        gradingResults.push({
          studentName: submission.name,
          testResults,
          totalPassed,
          totalFailed,
        });

      } catch (error) {
        gradingResults.push({
          studentName: submission.name,
          testResults: [],
          totalPassed: 0,
          totalFailed: testCases.length,
          loadError: (error as Error).message,
        });
      }
    }

    setResults(gradingResults);
    setProgress(null);
    setIsGrading(false);
  };

  const exportResults = () => {
    if (results.length === 0) return;

    const csvData = [];
    
    // Add header
    const testNames = testCases.map(t => t.name);
    csvData.push(['Student Name', 'Total Passed', 'Total Failed', ...testNames]);

    // Add data rows
    for (const result of results) {
      const row = [
        result.studentName,
        result.totalPassed.toString(),
        result.totalFailed.toString(),
      ];
      
      // Add test results
      for (const testCase of testCases) {
        const testResult = result.testResults.find(tr => tr.testName === testCase.name);
        row.push(testResult ? (testResult.passed ? 'PASS' : 'FAIL') : 'ERROR');
      }
      
      csvData.push(row);
    }

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `grading_results_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const clearAll = () => {
    setCsvFile(null);
    setYamlFile(null);
    setSubmissions([]);
    setTestCases([]);
    setResults([]);
    setError('');
    setProgress(null);
    
    // Reset the file input elements
    if (csvFileInputRef.current) {
      csvFileInputRef.current.value = '';
    }
    if (yamlFileInputRef.current) {
      yamlFileInputRef.current.value = '';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Turing Machine Grading System
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* File Upload Section */}
      <Box sx={{ mb: 4, display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
        <Box sx={{ flex: 1 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Upload Student Submissions (CSV)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              CSV should have columns: name, url
            </Typography>
            <input
              accept=".csv"
              style={{ display: 'none' }}
              id="csv-upload"
              type="file"
              ref={csvFileInputRef}
              onChange={handleCsvUpload}
            />
            <label htmlFor="csv-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<UploadIcon />}
                fullWidth
              >
                {csvFile ? csvFile.name : 'Choose CSV File'}
              </Button>
            </label>
            {submissions.length > 0 && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Loaded {submissions.length} submissions
              </Typography>
            )}
          </Paper>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Upload Test Cases (YAML)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              YAML should contain test cases with name, input, expected
            </Typography>
            <input
              accept=".yaml,.yml"
              style={{ display: 'none' }}
              id="yaml-upload"
              type="file"
              ref={yamlFileInputRef}
              onChange={handleYamlUpload}
            />
            <label htmlFor="yaml-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<UploadIcon />}
                fullWidth
              >
                {yamlFile ? yamlFile.name : 'Choose YAML File'}
              </Button>
            </label>
            {testCases.length > 0 && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Loaded {testCases.length} test cases
              </Typography>
            )}
          </Paper>
        </Box>
      </Box>

      {/* Controls */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          startIcon={<PlayIcon />}
          onClick={runGrading}
          disabled={isGrading || submissions.length === 0 || testCases.length === 0}
          size="large"
        >
          {isGrading ? 'Grading...' : 'Run Grading'}
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={exportResults}
          disabled={results.length === 0}
        >
          Export Results
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<ClearIcon />}
          onClick={clearAll}
          disabled={isGrading}
        >
          Clear All
        </Button>
      </Box>

      {/* Progress */}
      {progress && (
        <Paper sx={{ p: 2, mb: 4 }}>
          <Typography variant="body2" gutterBottom>
            Grading {progress.currentStudent} ({progress.current}/{progress.total})
            {progress.currentTest && ` - Running: ${progress.currentTest}`}
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={(progress.current - 1) / progress.total * 100} 
          />
        </Paper>
      )}

      {/* Results Table */}
      {results.length > 0 && (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <Typography variant="h6" sx={{ p: 2 }}>
            Grading Results
          </Typography>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Student Name</TableCell>
                  <TableCell align="center">Rules</TableCell>
                  <TableCell align="center">States</TableCell>
                  <TableCell align="center">Total Passed</TableCell>
                  <TableCell align="center">Total Failed</TableCell>
                  {testCases.map(test => (
                    <TableCell key={test.name} align="center">
                      {test.name}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {results.map((result) => {
                  // Get machine metrics from first test result (all tests for same machine have same metrics)
                  const firstTest = result.testResults[0];
                  const ruleCount = firstTest?.machineRuleCount ?? 'N/A';
                  const stateCount = firstTest?.machineUniqueStates ?? 'N/A';

                  return (
                    <TableRow key={result.studentName}>
                      <TableCell component="th" scope="row">
                        {result.studentName}
                        {result.loadError && (
                          <Tooltip title={result.loadError}>
                            <Chip
                              label="Load Error"
                              size="small"
                              color="error"
                              sx={{ ml: 1 }}
                            />
                          </Tooltip>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" fontFamily="monospace">
                          {ruleCount}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" fontFamily="monospace">
                          {stateCount}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={result.totalPassed}
                          color="success"
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={result.totalFailed}
                          color="error"
                          size="small"
                        />
                      </TableCell>
                      {testCases.map(test => {
                        const testResult = result.testResults.find(tr => tr.testName === test.name);

                        // Build detailed tooltip content
                        let tooltipContent = '';
                        if (testResult) {
                          tooltipContent = `Expected: "${testResult.expectedOutput}"\nActual: "${testResult.actualOutput}"`;
                          if (testResult.steps !== undefined) {
                            tooltipContent += `\nSteps: ${testResult.steps}`;
                          }
                          if (testResult.machineRuleCount !== undefined) {
                            tooltipContent += `\nRules: ${testResult.machineRuleCount}`;
                          }
                          if (testResult.machineUniqueStates !== undefined) {
                            tooltipContent += `\nStates: ${testResult.machineUniqueStates}`;
                          }
                          if (testResult.error) {
                            tooltipContent += `\nError: ${testResult.error}`;
                          }
                          // Check if outputs match when normalized
                          if (!testResult.passed) {
                            const expLower = testResult.expectedOutput.toLowerCase().trim();
                            const actLower = testResult.actualOutput.toLowerCase().trim();
                            if (expLower === actLower) {
                              tooltipContent += '\n⚠️ Match ignoring case/whitespace';
                            }
                          }
                        }

                        // Build label with steps for passed tests
                        let chipLabel = 'ERROR';
                        if (testResult) {
                          if (testResult.passed) {
                            chipLabel = `PASS (${testResult.steps ?? '?'})`;
                          } else {
                            chipLabel = 'FAIL';
                          }
                        }

                        return (
                          <TableCell key={test.name} align="center">
                            {testResult ? (
                              <Tooltip title={<span style={{ whiteSpace: 'pre-line' }}>{tooltipContent}</span>} arrow>
                                <Chip
                                  label={chipLabel}
                                  color={testResult.passed ? 'success' : 'error'}
                                  size="small"
                                />
                              </Tooltip>
                            ) : (
                              <Chip
                                label="ERROR"
                                color="warning"
                                size="small"
                              />
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Container>
  );
}

export default GradingPage;