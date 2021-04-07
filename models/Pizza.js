const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');
const assert = require('assert');

const PizzaSchema = new Schema({
    pizzaName: {
      type: String,
      required: [true,'Pizza name mandatory'],
      trim: true
    },
    createdBy: {
      type: String,
      required: [true,'Created by is mandatory'],
      trim:true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => dateFormat(createdAtVal)
    },
    size: {
      type: String,
      required:[true, 'Not valid size'],
      enum: ['Personal', 'Small', 'Medium', 'Large', 'Extra Large'],
      default: 'Large'
    },
    toppings: [],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
      }
    ]
  },
  {
    toJSON: {
      virtuals: true,
      getters: true
    },
    id: false
  }  
  );


// get total count of comments and replies on retrieval
PizzaSchema.virtual('commentCount').get(function() {
  return this.comments.reduce((total, comment) => total + comment.replies.length + 1, 0);
});

// create the Pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);
/*
//error validation
const badPizza = new Pizza({
  pizzaName : null,
  createdBy : null,
  size : 'super large'
});

let error = badPizza.validateSync();
assert.equal(error.errors['pizzaName'].message,'Pizza name mandatory');
assert.equal(error.errors['createdBy'].message,'Created by is mandatory');
assert.equal(error.errors['size'].message,'not valid size');*/

// export the Pizza model
module.exports = Pizza;