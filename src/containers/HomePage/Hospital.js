import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import LoadingIndicator from 'react-loading-indicator'
import { fetchHospital, fetchFloorsAt } from '../../actions'
import styled from 'styled-components'

//components
import { Table, BackToList } from '../../components'

const Content = styled.div`
  display: flex;
  justify-content: center;
`

class HospitalPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      _id: null,
    }
  }
  componentDidMount() {
    console.log('Hospital page mounted')
    const { _id } = this.props.match.params
    this.props.fetchHospital(_id)
    this.props.fetchFloorsAt(_id)
    this.setState({ _id })
  }
  componentDidUpdate() {
    const { _id } = this.props.match.params
    if (_id != this.state._id) {
      this.props.fetchHospital(_id)
      this.props.fetchFloorsAt(_id)
      this.setState({ _id })
    }
  }
  /* backRoute(){
        let path = [{ route: "/monitor", comment: "Monitor"}];
        return path;
    }*/
  renderFloorsList() {
    let i = 0
    const { url } = this.props.match
    const { floors_at } = this.props
    if (!floors_at) {
      return
    }
    if (floors_at.length === 0) {
      return
    }
    return _.map(floors_at, floor => {
      return (
        <div key={floor._id} className="col-sm-4">
          <div className="text-center">
            <h3 className="">
              <strong>{floor.number} floor</strong>
            </h3>
            <p>Number of Rooms: {floor._room_list.length}</p>
            <Link to={`${url}/floor=${floor._id}`} className="btn btn-default">
              Go
            </Link>
          </div>
        </div>
      )
    })
  }
  render() {
    let { hospital } = this.props
    if (!hospital) {
      return (
        <div className="text-center">
          <LoadingIndicator />
        </div>
      )
    }
    return (
      <div id="hospital" className="table-wrapper">
        {/* <BackToList route={this.backRoute()} /><div className="btn btn-primary active">{this.props.hospital.name}</div> */}
        <h3 className="text-center">{hospital.name}</h3>
        <Content>{this.renderFloorsList()}</Content>
      </div>
    )
  }
}
function mapStateToProps(state) {
  // console.log("hospitals log", hospitals[ownProps.match.params._id]);
  const { hospital, floors_at } = state.hospitals

  return { hospital, floors_at }
}

export default connect(mapStateToProps, { fetchHospital, fetchFloorsAt })(HospitalPage)
