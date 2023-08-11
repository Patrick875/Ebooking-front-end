import { toast } from 'react-hot-toast'
import { instance } from 'src/API/AxiosInstance'

const updateRoomStatus = async (data) => {
  await instance
    .post('/room/update-status', data)
    .then((res) => {
      if (res && res.data && Object.keys(res.data.data)) {
        if (data.status === 'out of order') {
          toast.success('Room placed out order ')
        } else {
          toast.success('Room made available ')
        }
      }
    })
    .catch((err) => {
      console.log('err', err)
    })
}
export const PutOutOfOrder = (props) => {
  const { roomId } = props

  return (
    <button
      className="button-new shadow-decrease"
      onClick={() => {
        updateRoomStatus({
          roomId: roomId,
          status: 'out of order',
        })
      }}
    >
      Put out of order
    </button>
  )
}
export const MakeAvailable = (props) => {
  const { roomId } = props

  return (
    <button
      className="button-new shadow-float-green"
      onClick={() => {
        updateRoomStatus({
          roomId: roomId,
          status: 'Available',
        })
      }}
    >
      Make available
    </button>
  )
}
