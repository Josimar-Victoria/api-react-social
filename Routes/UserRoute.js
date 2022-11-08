import express from 'express'
import {
  deleteUser,
  followUser,
  getUsersById,
  UnFollowUser,
  updateUser
} from '../Controllers/UserController.js'

const router = express.Router()

router.get('/:id', getUsersById)

router.put('/:id', updateUser)

router.delete('/:id', deleteUser)

router.put('/:id/follow', followUser)

router.put('/:id/unfollow', UnFollowUser)

export default router
