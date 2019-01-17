const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt');

let UserSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Incorrect format email address.']
  },
  username: {
    type: String
  },
  oauth_id: {
    type: String
  },
  password: { type: String },
  last_imei: String,
  ustype: {
    type: String,
    enum: ['customer', 'detailer', 'admin'],
    default: 'customer'
  },
  settings: {
    favorite_car: {
      type: Schema.Types.ObjectId,
      ref: 'Car',
      default: null
    },
    max_waiting_time: {
      type: String
    }
  },
  profile: {
    name: { type: String, require: true },
    phone: { type: String },
    age: { type: Number }
  },
  cancelled_services: { type: Number, default: 0 },
  last_service_recived: { type: Date, default: Date.now() }
},
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  });

UserSchema.pre('save', function (next) {
  let user = this;
  if (this.isModified('password' || this.isNew)) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err)
        return next(err)

      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err)
          return next(err)

        user.password = hash;
        next();
      })
    })
  } else
    return next();
});

UserSchema.pre('update', function (next) {
  if (this.getUpdate().$set.password)
    this.update({}, {
      password: bcrypt.hashSync(this.getUpdate().$set.password, 10)
    });

  next();
});

UserSchema.pre('findOneAndUpdate', function (next) {
  if (this.getUpdate().$set.password)
    this.update({}, {
      password: bcrypt.hashSync(this.getUpdate().$set.password, 10)
    });

  next();
});

UserSchema.methods.comparePassword = function (password) {
  return new Promise((resolve, reject) => {

    bcrypt.compare(password, this.password, (err, isMatch) => {
      if (err)
        reject(err);

      resolve(isMatch);
    });
  });
}

module.exports = mongoose.model('User', UserSchema);
