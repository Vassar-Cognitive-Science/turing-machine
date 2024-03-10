import { connect } from 'react-redux'
import RowItem from '../../components/table/RowItem'
import { moveToAction } from '../../actions/tableActions'

const moveTo = (dispatch, ownProps, from, to) => {
  dispatch(moveToAction(from, to))
}

const mapStateToProps = (state, ownProps) => ({})

const mapDispatchToProps = (dispatch, ownProps) => ({
  moveTo: (from, to) => { moveTo(dispatch, ownProps, from, to) }
})

export default connect(mapStateToProps, mapDispatchToProps)(RowItem)
