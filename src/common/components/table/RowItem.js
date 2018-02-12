import React from 'react';
import { findDOMNode } from 'react-dom'
import IconButton from 'material-ui/IconButton';
import Avatar from 'material-ui/Avatar';
import DeleteRowButton from '../../containers/table/DeleteRowButtonContainer';
import SwitchDirectionButton from '../../containers/table/SwitchDirectionButtonContainer';
import AutoCompleteField from '../../containers/table/AutoCompleteFieldContainer';

import flow from 'lodash/flow';
import { DropTarget, DragSource } from 'react-dnd';

import DragHandleIcon from 'material-ui/svg-icons/navigation/menu';

const style = {
	root: (isHighlighted, isDragging) => ({
		backgroundColor: isHighlighted ? "#87dbff" : "#fff",
		// display: 'flex',
		justifyContent: 'space-evenly',
		border: isDragging ? '2px dotted #aaa' : 'none'
	}),
	buttonContainer: {
		alignSelf: 'center',
		cursor: 'pointer',
		marginBottom: '-25px'
	},
	Avatar: {
		backgroundColor: '#2196F3',
		size: 25,
	}
}

export const FIELD_TYPES = ["Current State", "Read", "Write", "Direction", "New State"];

const standardizeDeleteButtonId = (id) => (`delete-row-button-of-${id}`);
const standardizeCurrentStateFieldId = (id) => (`current_state-of-${id}`);
const standardizeReadFieldId = (id) => (`read-of-${id}`);
const standardizeWriteFieldId = (id) => (`write-of-${id}`);
const standardizeDirectionFieldId = (id) => (`direction-of-${id}`);
const standardizeNewStateFieldId = (id) => (`new_state-of-${id}`);

const rowItemDnD = {
	ITEM_TYPE: "Row-Item",

	itemSource: {
		beginDrag(props) {
			return {
				id: props.id,
				index: props.index
			};
		},

		isDragging(props, monitor) {
			return props.id === monitor.getItem().id;
		}
	},

	itemTarget: {
		// better this way since we always want hover (for preview effects)
		canDrop() {
			return false;
		},

	  	hover(props, monitor, component) {
		  	const {id: draggedId, index: dragIndex } = monitor.getItem()
		    const {id: overId, index: hoverIndex } = props;

		    if (dragIndex === hoverIndex) return;
		    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

			// Get vertical middle
			const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

			// Determine mouse position
			const clientOffset = monitor.getClientOffset();

			// Get pixels to the top
			const hoverClientY = clientOffset.y - hoverBoundingRect.top;

			// Only perform the move when the mouse has crossed half of the items height
			// When dragging downwards, only move when the cursor is below 50%
			// When dragging upwards, only move when the cursor is above 50%

			// Dragging downwards
			if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;

			// Dragging upwards
			if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

			props.moveTo(dragIndex, hoverIndex);
			monitor.getItem().index = hoverIndex;
		}
	},

	sourceCollector: (connect, monitor) => ({
		connectDragSource: connect.dragSource(),
		connectDragPreview: connect.dragPreview(),
		isDragging: monitor.isDragging(),
	}),

	targetCollector: (connect, monitor) => ({
		connectDropTarget: connect.dropTarget(),
		isOverCurrent: monitor.isOver({
			shallow: true
		}),
	})
}


class RowItem extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {
			rowNum, 
			id,
			isHighlighted,
			connectDropTarget,
			connectDragPreview,
			connectDragSource,
			isDragging
		} = this.props;

		return connectDragPreview(connectDropTarget(
			<div className="RowItemContainer" style={{...style.root(isHighlighted, isDragging)}}>
				{
				connectDragSource(
					<div style={{...style.buttonContainer}}>
						<Avatar
							{...style.Avatar}
						>
							{rowNum}
						</Avatar>
					</div>
				)
				}
				<AutoCompleteField 
					parent={id} 
					fieldType={FIELD_TYPES[0]} 
					floatingLabelText={FIELD_TYPES[0]}
                    id={standardizeCurrentStateFieldId(id)} 
                />
                <AutoCompleteField 
					parent={id} 
					fieldType={FIELD_TYPES[1]} 
					floatingLabelText={FIELD_TYPES[1]}
                    id={standardizeCurrentStateFieldId(id)} 
                />
                <AutoCompleteField 
					parent={id} 
					fieldType={FIELD_TYPES[2]} 
					floatingLabelText={FIELD_TYPES[2]}
                    id={standardizeCurrentStateFieldId(id)} 
                />
                <SwitchDirectionButton 
                	parent={id} 
                	fieldType={FIELD_TYPES[3]} 
                	floatingLabelText={FIELD_TYPES[3]}
                    id={standardizeDirectionFieldId(id)} 
                />
                <AutoCompleteField 
					parent={id} 
					fieldType={FIELD_TYPES[4]} 
					floatingLabelText={FIELD_TYPES[4]}
                    id={standardizeCurrentStateFieldId(id)} 
                />
				<div style={{...style.buttonContainer}}>
					<DeleteRowButton parent={id} rowNum={rowNum} />
				</div>
			</div>
		))
	}
}


export default flow(
	DragSource(
		rowItemDnD.ITEM_TYPE,
		rowItemDnD.itemSource,
		rowItemDnD.sourceCollector
	),
	DropTarget(
		rowItemDnD.ITEM_TYPE,
		rowItemDnD.itemTarget,
		rowItemDnD.targetCollector
	)
)(RowItem);