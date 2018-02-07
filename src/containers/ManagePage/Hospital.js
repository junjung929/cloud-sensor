import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, initialize } from 'redux-form'
import { Link } from 'react-router-dom'
import LoadingIndicator from 'react-loading-indicator'
import {
  fetchHospital,
  fetchFloorsAt,
  fetchFloor,
  fetchRoomsAt,
  fetchBedsAt,
  deleteRoom,
  deleteBed,
  addFloor,
  editFloor,
  deleteFloor,
  addFloorAt,
  deleteFloorAt,
} from '../../actions'
import Modal from 'react-responsive-modal'

import { Table, Profile, getOrdinal, RenderField, RenderPhotoField, FormReset } from '../../components'

import { PreviewImg, Content, ImgPreview } from './styles'

class Hospital extends Component {
  constructor(props) {
    super(props)

    this.state = {
      modalMode: null,
      open: false,
      updating: false,
      updatingText: null,
      currHospital: null,
      currFloor: null,
      file: null,
      imagePreviewUrl: null,
    }
    this.onFormSubmit = this.onFormSubmit.bind(this)
    // this.onEditFormSubmit = this.onEditFormSubmit.bind(this);
  }
  componentDidMount() {
    const { hospital, floor } = this.props
    const { id } = this.props.match.params
    this.setState({ currHospital: id })
    this.props.fetchHospital(id)
    this.props.fetchFloorsAt(id)
    // let { _id } = this.props.match.params
    // console.log(_id)
  }
  componentDidUpdate() {
    const { id } = this.props.match.params
    const { currHospital } = this.state
    if (currHospital !== id) {
      this.props.fetchFloorsAt(id)
      this.setState({ currHospital: id })
    }
  }
  handleInitialize() {
    const { number } = this.props.floor
    const iniData = {
      number,
    }
    this.props.initialize(iniData)
  }
  handleInitializeNull() {
    const iniData = null
    this.props.initialize(iniData)
  }
  onPhotoChange(e) {
    e.preventDefault()

    let reader = new FileReader()
    let file = e.target.files[0]
    reader.onloadend = () => {
      this.setState({ file, imagePreviewUrl: reader.result })
    }
    reader.readAsDataURL(file)
    console.log(file)
  }

  deleteFloor = (floorId, number) => e => {
    const { id } = this.props.match.params
    onClick: if (
      window.confirm(
        'This behaviour will also affect all information which is childe components of this floor.\nAre you sure to delete?'
      )
    ) {
      this.setState({ updating: true, updatingText: 'initial' })
      this.props.deleteFloor(floorId).then(callback => {
        this.props.deleteFloorAt(id, { floorId: floorId }).then(() => {
          this.props.fetchRoomsAt(floorId).then(() => {
            const { rooms_at } = this.props
            if (!rooms_at) {
              return
            }
            _.map(rooms_at, room => {
              this.props.deleteRoom(room._id)
              this.props.fetchBedsAt(room._id).then(() => {
                const { beds_at } = this.props
                if (!beds_at) {
                  return
                }
                _.map(beds_at, bed => {
                  this.props.deleteBed(bed._id)
                })
              })
            })
          })
        })
        this.setState({
          updatingText: `${getOrdinal(number)} floor has been successfully deleted!`,
        })
        this.props.fetchFloorsAt(id)
      })
    }
  }
  addFloor = (values, file) => {
    const { id } = this.props.match.params
    console.log(values)
    this.props.addFloor(values, file).then(callback => {
      this.props.addFloorAt(id, { floorId: callback._id }).then(() => {
        this.setState({ updatingText: `${values.number} floor is added!` })
        this.props.fetchFloorsAt(id)
        this.onCloseModal()
      })
    })
  }
  editFloor = (floorId, values, file) => {
    const { id } = this.props.match.params
    this.props.editFloor(floorId, values, file).then(err => {
      if (err) {
        return this.setState({ updatingText: `${err}, please try again.` })
      }

      this.setState({ updatingText: `${values.number} is edited!` })

      this.props.fetchFloorsAt(id)
      this.onCloseModal()
    })
  }
  onFormSubmit = (data, mode, floorId) => {
    const { id } = this.props.match.params
    const temp = Object.assign(data, { floorAt: id })
    data = temp
    // console.log(data)
    if (!data) {
      return alert('dfa')
    }
    const { file, onSubmit } = this.state

    //file config
    const newData = new FormData()

    newData.set('file', file)
    this.setState({ updating: true, updatingText: 'initial' })
    switch (mode) {
      case 'add':
        console.log(data)
        this.addFloor(data, newData)
        break
      case 'edit':
        this.editFloor(floorId, data, newData)
        break
    }
  }

  renderModal(mode) {
    // console.log(this.props.initialize)
    const { floor, handleSubmit } = this.props
    let { imagePreviewUrl } = this.state
    let $imagePreview = null
    let title = '',
      submitHandler = '',
      placeholder = {
        number: 'Enter an integer number.',
        button: 'Add',
      }
    switch (mode) {
      case 'edit':
        if (!floor) {
          return <div />
        }
        title = `${getOrdinal(floor.number)} floor Edit`
        submitHandler = data => {
          this.onFormSubmit(data, mode, floor._id)
        }

        placeholder.number = floor.number
        placeholder.button = 'Edit'
        break
      default:
        title = 'Add a floor'
        submitHandler = data => {
          this.onFormSubmit(data, mode)
        }
    }
    if (imagePreviewUrl) {
      $imagePreview = (
        <ImgPreview>
          <PreviewImg src={imagePreviewUrl} />
        </ImgPreview>
      )
    } else if (mode === 'edit') {
      $imagePreview = (
        <ImgPreview>
          <PreviewImg src={floor.imgSrc} alt={`${floor.number} floor main photo`} />
        </ImgPreview>
      )
    } else {
      $imagePreview = <div />
    }

    return (
      <div>
        <h3>{title}</h3>
        <form id="floorForm" className="form-group" onSubmit={handleSubmit(submitHandler)}>
          <Field
            label="Photo of Floor"
            name="thumb_picture"
            component={RenderPhotoField}
            onChange={e => {
              this.onPhotoChange(e)
            }}
          />
          {$imagePreview}
          <div className="divisionLine" />
          <Field
            label="Number of Floor"
            name="number"
            type="number"
            placeholder={placeholder.number}
            component={RenderField}
          />
          <div className="divisionLine" />
          <button type="submit" className="btn btn-primary">
            {placeholder.button}
          </button>
          <div
            className="btn btn-danger"
            onClick={() => {
              this.onCloseModal()
            }}
          >
            Cancel
          </div>
        </form>
      </div>
    )
  }
  onOpenModal(floorId) {
    const { modalMode } = this.state
    this.props.fetchFloor(floorId).then(() => {
      const { floor } = this.props
      if (floor && modalMode === 'edit') {
        this.handleInitialize()
        this.setState({ open: true, currFloor: floorId })
      }
    })
  }
  onCloseModal() {
    this.setState({
      open: false,
      currFloor: null,
      file: null,
      imagePreviewUrl: null,
    })
    FormReset(this.props)
  }
  renderFloors() {
    const { floors_at } = this.props
    let i = 0
    if (!floors_at) {
      return <tr />
    }
    return _.map(floors_at, floor => {
      return (
        <tr key={floor._id} id={floor._id}>
          <th scope="row" width="10%">
            {++i}
          </th>
          <td>{getOrdinal(floor.number)} floor</td>
          <td width="10%">
            <button
              className="btn btn-default"
              onClick={() => {
                this.setState({ modalMode: 'edit' }, () => {
                  this.onOpenModal(floor._id)
                })
              }}
            >
              Open
            </button>
          </td>
          <td width="10%">
            <button className="btn btn-danger" onClick={this.deleteFloor(floor._id, floor.number)}>
              Delete
            </button>
          </td>
        </tr>
      )
    })
  }
  render() {
    const { hospital } = this.props
    const { open, updating, updatingText, currFloor, modalMode } = this.state
    const tableHeadRow = (
      <tr>
        <td>No.</td>
        <td>Name</td>
        <td>Edit</td>
        <td>Delete</td>
      </tr>
    )
    const tableBody = this.renderFloors()
    let modalContent = <LoadingIndicator />
    if (!hospital) {
      return (
        <div className="text-center">
          <LoadingIndicator />
        </div>
      )
    }
    if (modalMode !== null) {
      modalContent = this.renderModal(modalMode)
    }
    return (
      <div id="floors">
        <h3 className="text-center">{hospital.name}</h3>

        <Content>
          <button
            className="btn btn-primary pull-left"
            onClick={() => {
              this.setState({ modalMode: 'add', open: true })
              this.handleInitializeNull()
            }}
          >
            Add
          </button>
          <div className="divisionLine" />
          <Table tableHeadRow={tableHeadRow} tableBody={tableBody} />
        </Content>
        <Modal
          open={open}
          onClose={() => {
            this.onCloseModal()
          }}
        >
          {modalContent}
        </Modal>
        {/* updating alert modal */}
        <Modal
          open={updating}
          onClose={() => {
            this.onCloseModal()
          }}
        >
          {(() => {
            switch (updatingText) {
              case 'initial':
                return <LoadingIndicator />

                break
              default:
                return (
                  <div>
                    <p>{updatingText}</p>
                    <button
                      className="btn btn-sm btn-default"
                      onClick={() => {
                        this.setState({ updating: false })
                      }}
                    >
                      Check
                    </button>
                  </div>
                )
            }
          })()}
        </Modal>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { hospital, floors_at } = state.hospitals
  const { floor, add_floor, edit_floor, rooms_at } = state.floors
  const { beds_at } = state.rooms
  return {
    hospital,
    floors_at,
    floor,
    add_floor,
    rooms_at,
    beds_at,
  }
}

function validate(values) {
  // console.log(valuues) -> { title: "", categories: "", content: ""}
  const errors = {}
  // Validate the inputs from 'values'
  if (!values.number) {
    errors.number = 'Enter an integer number'
  }
  // If errors is empty, the form is fine to submit
  // If errors hs *any* properties, redux form assumes form is invalid
  return errors
}

export default reduxForm({
  validate,
  form: `FloorEditForm`,
})(
  connect(mapStateToProps, {
    fetchHospital,
    fetchFloorsAt,
    fetchFloor,
    fetchRoomsAt,
    fetchBedsAt,
    deleteRoom,
    deleteBed,
    addFloor,
    editFloor,
    deleteFloor,
    addFloorAt,
    deleteFloorAt,
  })(Hospital)
)
