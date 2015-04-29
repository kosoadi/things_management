/*
* class PropertyController.js
* @author: Prakoso Adi Nugroho - 1106053685 <prakoso.adi.n@gmail.com>
*
*/

var mongoose = require('mongoose');
var Property = mongoose.model("../models/Property");
var Thing = mongoose.model("../models/Thing");
var Category = mongoose.model("../models/Category");
var Developer = mongoose.model("../models/Developer");
var Product = mongoose.model("../models/Product");
var User = mongoose.model("../models/User");
var ObjectId = mongoose.Types.ObjectId;
