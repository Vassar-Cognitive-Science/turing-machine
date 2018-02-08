import React from 'react';
import { findDOMNode } from 'react-dom'
import IconButton from 'material-ui/IconButton';
import Avatar from 'material-ui/Avatar';
import DeleteRowButton from '../../containers/table/DeleteRowButtonContainer';
import SwitchDirectionButton from '../../containers/table/SwitchDirectionButtonContainer';
import AutoCompleteField from '../../containers/table/AutoCompleteFieldContainer';

import {
  TABLE_INPUT_COL_STYLE,
  TABLE_STATE_COL_STYLE,
} from '../../constants/components/Table';

import flow from 'lodash/flow';
import { DropTarget, DragSource } from 'react-dnd';

import DragHandleIcon from 'material-ui/svg-icons/navigation/menu';

const highlightColor = "#87dbff";
const normalColor = "#fff";

const style = {
	root: (isHighlighted) => ({
		backgroundColor: isHighlighted ? highlightColor : normalColor,
		display: 'flex',
		justifyContent: 'space-evenly' 
	}),
	buttonContainer: {
		alignSelf: 'center'
	}
}

export const FIELD_TYPES = ["Current State", "Read", "Write", "Direction", "New State"];

let DELETE_BUTTON_ID_PREFIX = "delete-row-button-of-";
let CURRENT_STATE_COL_ID_PREFIX = "current_state-of-";
let READ_COL_ID_PREFIX = "read-of-";
let WRITE_COL_ID_PREFIX = "write-of-";
let DIRECTION_COL_ID_PREFIX = "direction-of-";
let NEW_STATE_COL_ID_PREFIX = "new_state-of-";

export const standardizeDeleteButtonId = (id) => (DELETE_BUTTON_ID_PREFIX + id);

export const standardizeCurrentStateFieldId = (id) => (CURRENT_STATE_COL_ID_PREFIX + id);

export const standardizeReadFieldId = (id) => (READ_COL_ID_PREFIX + id);

export const standardizeWriteFieldId = (id) => (WRITE_COL_ID_PREFIX + id);

export const standardizeDirectionFieldId = (id) => (DIRECTION_COL_ID_PREFIX + id);

export const standardizeNewStateFieldId = (id) => (NEW_STATE_COL_ID_PREFIX + id);

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
			isOverCurrent,
			isEnabled,
			isSelected
		} = this.props;

		return connectDragPreview(connectDropTarget(
			<div style={{...style.root(isHighlighted)}}>
				{
					connectDragSource(
						<div style={{...style.buttonContainer}}>
							<Avatar
								size={25}
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
				<div style={{...style.buttonContainer}}><DeleteRowButton parent={id} rowNum={rowNum} /></div>
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