import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, initialize } from 'redux-form'
import { Link } from 'react-router-dom'
import LoadingIndicator from 'react-loading-indicator'
import {
  fetchFloor,
  fetchRoomsAt,
  fetchRoom,
  fetchBedsAt,
  addRoom,
  editRoom,
  deleteRoom,
  addRoomAt,
  deleteRoomAt,
  deleteBed,
} from '../../actions'
import Modal from 'react-responsive-modal'

import {
  Table,
  Profile,
  getOrdinal,
  RenderField,
  RenderPhotoField,
  RenderSelectField,
  FormReset,
} from '../../components'

import { PreviewImg, Content, ImgPreview } from './styles'

class Floor extends Component {
  constructor(props) {
    super(props)

    this.state = {
      modalMode: null,
      open: false,
      updating: false,
      updatingText: null,
      currFloor: null,
      currRoom: null,
      file: null,
      imagePreviewUrl: null,
    }
    this.onFormSubmit = this.onFormSubmit.bind(this)
    // this.onEditFormSubmit = this.onEditFormSubmit.bind(this);
  }
  componentDidMount() {
    const { floor, room } = this.props
    const { floor_id } = this.props.match.params
    this.setState({ currFloor: floor_id })
    this.props.fetchFloor(floor_id)
    this.props.fetchRoomsAt(floor_id)
    // let { _id } = this.props.match.params
    // console.log(_id)
  }
  componentDidUpdate() {
    const { floor_id } = this.props.match.params
    const { currFloor } = this.state
    if (currFloor !== floor_id) {
      this.props.fetchRoomsAt(floor_id)
      this.setState({ currFloor: floor_id })
    }
  }
  handleInitialize() {
    const { number, room_class } = this.props.room
    const iniData = {
      number,
      room_class,
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

  deleteRoom = (roomId, number) => e => {
    const { floor_id } = this.props.match.params
    onClick: if (
      window.confirm(
        'This behaviour will also affect all information which is childe components of this room.\nAre you sure to delete?'
      )
    ) {
      this.setState({ updating: true, updatingText: 'initial' })
      this.props.deleteRoom(roomId).then(callback => {
        this.props.deleteRoomAt(floor_id, { roomId: roomId }).then(() => {
          this.props.fetchBedsAt(roomId).then(() => {
            const { beds_at } = this.props
            if (!beds_at) {
              return
            }
            _.map(beds_at, bed => {
              this.props.deleteBed(bed._id)
            })
          })
        })
        this.setState({
          updatingText: `${getOrdinal(number)} room has been successfully deleted!`,
        })
        this.props.fetchRoomsAt(floor_id)
      })
    }
  }
  addRoom = (values, file) => {
    const { floor_id } = this.props.match.params
    console.log(values)
    this.props.addRoom(values, file).then(callback => {
      this.props.addRoomAt(floor_id, { roomId: callback._id }).then(() => {
        this.setState({ updatingText: `Room No. ${values.number} is added!` })
        this.props.fetchRoomsAt(floor_id)
        this.onCloseModal()
      })
    })
  }
  editRoom = (roomId, values, file) => {
    const { floor_id } = this.props.match.params
    this.props.editRoom(roomId, values, file).then(err => {
      if (err) {
        return this.setState({ updatingText: `${err}, please try again.` })
      }

      this.setState({ updatingText: `Room No. ${values.number} is edited!` })

      this.props.fetchRoomsAt(floor_id)
      this.onCloseModal()
    })
  }
  onFormSubmit = (data, mode, roomId) => {
    const { floor_id } = this.props.match.params
    const temp = Object.assign(data, { roomAt: floor_id })
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
        this.addRoom(data, newData)
        break
      case 'edit':
        this.editRoom(roomId, data, newData)
        break
    }
  }
  selectOption() {
    const options = [
      { value: 'normal', text: 'Normal' },
      { value: 'important', text: 'Important' },
      { value: 'vip', text: 'VIP' },
    ]
    return _.map(options, option => {
      return (
        <option key={option.value} value={option.value}>
          {option.text} class
        </option>
      )
    })
  }
  renderModal(mode) {
    // console.log(this.props.initialize)
    const { room, handleSubmit } = this.props
    let { imagePreviewUrl } = this.state
    let $imagePreview = null
    let title = '',
      submitHandler = '',
      placeholder = {
        number: 'Enter an integer number.',
        room_class: 'Please select a class for the room.',
        button: 'Add',
      }
    switch (mode) {
      case 'edit':
        if (!room) {
          return <div />
        }
        title = `Room No.${room.number} Edit`
        submitHandler = data => {
          this.onFormSubmit(data, mode, room._id)
        }

        placeholder.number = room.number
        placeholder.button = 'Edit'
        break
      default:
        title = 'Add a room'
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
          <PreviewImg src={room.imgSrc} alt={`${room.number} room main photo`} />
        </ImgPreview>
      )
    } else {
      $imagePreview = <div />
    }

    return (
      <div>
        <h3>{title}</h3>
        <form id="roomForm" className="form-group" onSubmit={handleSubmit(submitHandler)}>
          <Field
            label="Photo of Room"
            name="thumb_picture"
            component={RenderPhotoField}
            onChange={e => {
              this.onPhotoChange(e)
            }}
          />
          {$imagePreview}
          <div className="divisionLine" />
          <Field
            label="Number of Room"
            name="number"
            type="number"
            placeholder={placeholder.number}
            component={RenderField}
          />
          <Field
            label="Class of Room"
            name="room_class"
            placeholder={placeholder.room_class}
            component={RenderSelectField}
            option={this.selectOption()}
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
  onOpenModal(roomId) {
    const { modalMode } = this.state
    this.props.fetchRoom(roomId).then(() => {
      const { room } = this.props
      if (room && modalMode === 'edit') {
        this.handleInitialize()
        this.setState({ open: true, currRoom: roomId })
      }
    })
  }
  onCloseModal() {
    this.setState({
      open: false,
      currRoom: null,
      file: null,
      imagePreviewUrl: null,
    })
    FormReset(this.props)
  }
  renderRooms() {
    const { rooms_at } = this.props
    let i = 0
    if (!rooms_at) {
      return <tr />
    }
    return _.map(rooms_at, room => {
      return (
        <tr key={room._id} id={room._id}>
          <th scope="row" width="10%">
            {++i}
          </th>
          <td>Room No. {room.number}</td>
          <td>{room.room_class}</td>
          <td width="10%">
            <button
              className="btn btn-default"
              onClick={() => {
                this.setState({ modalMode: 'edit' }, () => {
                  this.onOpenModal(room._id)
                })
              }}
            >
              Open
            </button>
          </td>
          <td width="10%">
            <button className="btn btn-danger" onClick={this.deleteRoom(room._id, room.number)}>
              Delete
            </button>
          </td>
        </tr>
      )
    })
  }
  render() {
    const { floor } = this.props
    const { open, updating, updatingText, currRoom, modalMode } = this.state
    const tableHeadRow = (
      <tr>
        <td>No.</td>
        <td>Name</td>
        <td>Class</td>
        <td>Edit</td>
        <td>Delete</td>
      </tr>
    )
    const tableBody = this.renderRooms()
    let modalContent = <LoadingIndicator />
    if (!floor) {
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
      <div id="rooms">
        <h3 className="text-center">{getOrdinal(floor.number)} floor</h3>

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
  const { floor, rooms_at } = state.floors
  const { room, add_room, edit_room, beds_at } = state.rooms
  return {
    floor,
    rooms_at,
    room,
    add_room,
    beds_at,
  }
}

function validate(values) {
  // console.log(valuues) -> { title: "", categories: "", content: ""}
  const errors = {}
  // Validate the inputs from 'values'
  if (!values.number) {
    errors.number = 'Enter an integer number!'
  }
  if (!values.room_class) {
    errors.room_class = 'Choose a class!'
  }
  // If errors is empty, the form is fine to submit
  // If errors hs *any* properties, redux form assumes form is invalid
  return errors
}

export default reduxForm({
  validate,
  form: `RoomEditForm`,
})(
  connect(mapStateToProps, {
    fetchFloor,
    fetchRoomsAt,
    fetchRoom,
    fetchBedsAt,
    addRoom,
    editRoom,
    deleteRoom,
    addRoomAt,
    deleteRoomAt,
    deleteBed,
  })(Floor)
)
