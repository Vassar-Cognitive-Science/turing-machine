import yaml from 'js-yaml';
import { TrialData } from '../../stores/trialStore';

export interface YAMLTrialData {
  name: string;
  startState: string;
  startTape: string;
  expectedTape: string;
  startTapeHead?: number;
  description?: string;
}

export interface YAMLTestSuite {
  name?: string;
  description?: string;
  version?: string;
  tests: YAMLTrialData[];
}

export const convertTrialsToYAML = (trials: TrialData[]): string => {
  const yamlTrials: YAMLTrialData[] = trials.map(trial => ({
    name: trial.name,
    startState: trial.startState,
    startTape: trial.startTape,
    expectedTape: trial.expectedTape,
    ...(trial.startTapeHead !== 0 && { startTapeHead: trial.startTapeHead }),
  }));

  const testSuite: YAMLTestSuite = {
    name: 'Turing Machine Test Suite',
    description: 'Exported test cases for Turing Machine simulator. Tests run in turbo mode (maximum speed). Only tape content is compared. Leading/trailing blanks ignored. Head position specified by startTapeHead (default: 0).',
    version: '2.0',
    tests: yamlTrials,
  };

  return yaml.dump(testSuite, {
    indent: 2,
    lineWidth: 120,
    noRefs: true,
  });
};

export const convertYAMLToTrials = (yamlContent: string): TrialData[] => {
  try {
    const parsed = yaml.load(yamlContent) as YAMLTestSuite;
    
    if (!parsed || !parsed.tests || !Array.isArray(parsed.tests)) {
      throw new Error('Invalid YAML format: missing tests array');
    }

    return parsed.tests.map((test, index) => {
      if (!test.name || !test.startState || test.startTape === undefined || test.expectedTape === undefined) {
        throw new Error(`Invalid test at index ${index}: missing required fields (name, startState, startTape, expectedTape)`);
      }

      const trial: TrialData = {
        id: `imported-${Date.now()}-${index}`,
        name: test.name,
        startState: test.startState,
        startTape: test.startTape,
        expectedTape: test.expectedTape,
        tapePointer: 0, // Always start at 0, not used in comparison
        expectedTapePointer: 0, // Not used in comparison
        startTapeHead: test.startTapeHead ?? 0,
        expectedTapeHead: 0, // Not used in comparison
        status: 'pending',
        result: null,
        error: null,
        executionTime: 0,
        steps: 0,
        actualOutput: '',
        createdAt: new Date().toISOString(),
      };

      return trial;
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to parse YAML: ${error.message}`);
    }
    throw new Error('Failed to parse YAML: Unknown error');
  }
};

export const downloadYAMLFile = (content: string, filename?: string): void => {
  const blob = new Blob([content], { type: 'text/yaml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `turing-machine-tests-${new Date().toISOString().split('T')[0]}.yaml`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

export const validateYAMLTestSuite = (yamlContent: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  try {
    const parsed = yaml.load(yamlContent) as YAMLTestSuite;
    
    if (!parsed) {
      errors.push('Empty or invalid YAML content');
      return { valid: false, errors };
    }
    
    if (!parsed.tests) {
      errors.push('Missing "tests" array');
      return { valid: false, errors };
    }
    
    if (!Array.isArray(parsed.tests)) {
      errors.push('"tests" must be an array');
      return { valid: false, errors };
    }
    
    parsed.tests.forEach((test, index) => {
      if (!test.name) {
        errors.push(`Test ${index + 1}: missing "name" field`);
      }
      if (!test.startState) {
        errors.push(`Test ${index + 1}: missing "startState" field`);
      }
      if (test.startTape === undefined) {
        errors.push(`Test ${index + 1}: missing "startTape" field`);
      }
      if (test.expectedTape === undefined) {
        errors.push(`Test ${index + 1}: missing "expectedTape" field`);
      }
      if (test.startTapeHead !== undefined && typeof test.startTapeHead !== 'number') {
        errors.push(`Test ${index + 1}: "startTapeHead" must be a number`);
      }
    });
    
  } catch (error) {
    if (error instanceof Error) {
      errors.push(`YAML parsing error: ${error.message}`);
    } else {
      errors.push('Unknown YAML parsing error');
    }
  }
  
  return { valid: errors.length === 0, errors };
};