// Npm require ↓

const Joi = require("joi");

// Schemas ↓

const newOfferJoi = Joi.object().keys({
  url: Joi.string().uri().max(280).required(),
  title: Joi.string().max(30).required(),
  descrip: Joi.string().max(140),
  price: Joi.number().positive().precision(2),
  offer_price: Joi.number().positive().precision(2),
  plataform: Joi.string(),
  offer_expiry: Joi.date().required(),
});

const modifyOfferJoi = Joi.object().keys({
  url: Joi.string().uri().max(280),
  title: Joi.string().max(30),
  descrip: Joi.string().max(140),
  price: Joi.number().positive().precision(2),
  offer_price: Joi.number().positive().precision(2),
  plataform: Joi.string(),
  offer_expiry: Joi.date(),
});

const voteOfferJoi = Joi.object().keys({
  vote: Joi.number().min(1).max(5).required(),
});

const newCommentOfferJoi = Joi.object().keys({
  comment: Joi.string().max(145).required(),
});

const commentOfferJoi = Joi.object().keys({
  newComment: Joi.string().max(145).required(),
});

module.exports = {
  newOfferJoi,
  voteOfferJoi,
  modifyOfferJoi,
  commentOfferJoi,
  newCommentOfferJoi,
};
