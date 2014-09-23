var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

AnggotaProvider = function(host, port) {
  this.db= new Db('node-mongo-employee', new Server(host, port, {safe: false}, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};



AnggotaProvider.prototype.getCollection= function(callback) {
  this.db.collection('employees', function(error, user_collection) {
    if( error ) callback(error);
    else callback(null, user_collection);
  });
};

//tampilkan semua
AnggotaProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, user_collection) {
      if( error ) callback(error)
      else {
        user_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

//tampilkan by ID
AnggotaProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, user_collection) {
      if( error ) callback(error)
      else {
        user_collection.findOne({_id: user_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};


//simpan anggota
AnggotaProvider.prototype.save = function(employees, callback) {
    this.getCollection(function(error, user_collection) {
      if( error ) callback(error)
      else {
        if( typeof(employees.length)=="undefined")
          employees = [employees];

        for( var i =0;i< employees.length;i++ ) {
          employee = employees[i];
          employee.created_at = new Date();
        }

        user_collection.insert(employees, function() {
          callback(null, employees);
        });
      }
    });
};

//update anggota
AnggotaProvider.prototype.update = function(employeeId, employees, callback) {
    this.getCollection(function(error, user_collection) {
      if( error ) callback(error);
      else {
        user_collection.update(
					{_id: user_collection.db.bson_serializer.ObjectID.createFromHexString(employeeId)},
					employees,
					function(error, employees) {
						if(error) callback(error);
						else callback(null, employees)       
					});
      }
    });
};

//delete anggota
AnggotaProvider.prototype.delete = function(employeeId, callback) {
	this.getCollection(function(error, user_collection) {
		if(error) callback(error);
		else {
			user_collection.remove(
				{_id: user_collection.db.bson_serializer.ObjectID.createFromHexString(employeeId)},
				function(error, employee){
					if(error) callback(error);
					else callback(null, employee)
				});
			}
	});
};

exports.AnggotaProvider = AnggotaProvider;
