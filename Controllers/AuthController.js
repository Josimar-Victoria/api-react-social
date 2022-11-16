import UserModel from '../Models/userModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// Registering a new User
export const registerUser = async (req, res) => {
  // const { username, password, firstname, lastname } = req.body

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(req.body.password, salt)
  req.body.password = hashedPassword
  // const newUser = new UserModel({
  //   username,
  //   password: hashedPassword,
  //   firstname,
  //   lastname
  // })
  const newUser = new UserModel(req.body)
  const { username } = req.body

  try {
    const oldUser = await UserModel.findOne({ username })

    if (oldUser)
      res.status(400).json({ msg: 'username is already registered! ' })
    const user = await newUser.save()

    const toke = jwt.sign(
      {
        username: user.username,
        id: user._id
      },
      process.env.JWT_KEY,
      { expiresIn: '1h' }
    )

    res.status(201).json({ user, toke })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Login User
export const loginUser = async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await UserModel.findOne({ username: username })

    if (user) {
      const validity = await bcrypt.compare(password, user.password)
      if (!validity) res.status(401).json({ msg: 'Invalid password' })
      else {
        const toke = jwt.sign(
          {
            username: user.username,
            id: user._id
          },
          process.env.JWT_KEY,
          { expiresIn: '1h' }
        )
        res.status(200).json({ user, toke })
      }
    } else {
      res.status(403).json('User does not exists')
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
