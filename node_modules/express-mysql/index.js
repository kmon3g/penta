/*! 
* Connect - mysql
* Copyright(c) 2014 Ryan Clough <ryanc1256@gmail.com>
* MIT Licensed
*/

var oneDay = 86400;

module.exports = function(session){
	var Store = session.Store;	


	function mysqlStore(options){
		var self = this;
		options = options || {};
		Store.call(this, options);
		this.prefix = null || options.prefix ? options.prefix : 'sess';			
		this.client = options.client || new require('mysql').createConnection({host: options.host, database: options.database, user: options.user, password: options.pass});
		
		if (this.client){
			this.client.connect(function(err){
				self.client.emit('connection');
			});
		}

		this.table = options.table ? options.table : 'sessions';

		if ( this.table ) {
			self.testConnection();	
		}
		self.client.on('error', function(){self.emit('disconnect')});
		self.client.on('connection', function(err, value){self.emit('connect')});
	};


	/*
	* This is to test if the table exists
	* @API: public
	*/

	mysqlStore.prototype.testConnection = function(){		
		this.client.query("SELECT sID FROM " + this.table, function(err, result){
			if (err && err.errno === 1146) {
				console.error('TABLE DOESN\'t Exists -> please create it... \n');
			} else if (err) {
				console.error(err);
			}
		});
	}

	mysqlStore.prototype.__proto__ = Store.prototype;

	/*
	* @param: fn {function} callback
	* @param: sid {string} cookie string
	* @API: public
	*/

	mysqlStore.prototype.get = function(sid, fn){
		sid = this.prefix + sid;
		this.client.query('SELECT data FROM ' + this.table + ' WHERE sid = ? LIMIT 1', [sid], function(err, data){
			if (err){
				return fn(err);
			}
			if (!data || data.length < 1){
				return fn()
			}

			var result;
			try {
				result = JSON.parse(data[0].data);
			} catch (e){
				return fn(e);
			}
			return fn(null, result);
			//this.client.disconnect();
		});
	};

	/*
	* @param: fn {function} callback
	* @param: sid {string} cookie string
	* @param: sess {object} session object
	* @API: public
	*/

	mysqlStore.prototype.set = function(sid, sess, fn){		
		var self = this;
		sid = this.prefix + sid;
		try {
			var maxAge = sess.cookie.maxAge,
				ttl = this.ttl,
				sess = JSON.stringify(sess);

			ttl = ttl || ('number' == typeof maxAge ? maxAge / 1000 | 0 : oneDay);
			//this.client.connect();
			this.client.query('SELECT sID FROM ' + this.table + ' WHERE sID = ?', [sid], function(err, value){
				if (!err && value && value.length > 0){
					self.client.query("UPDATE " + self.table + ' SET data = ? WHERE sid=?', [sess, sid], function(err){
						if (err) {console.error(err)};
						fn && fn.apply(this, arguments);
					});
				} else if (!err && value){
					self.client.query('INSERT INTO ' + self.table + ' (sID, data) VALUES (?, ?) ', [sid, sess], function(err){
						if (err){console.error(err)}
						fn && fn.apply(this, arguments)
					});
				}

			});
		} catch (e){
			fn && fn(e);
		}
	};

	/*
	* @param: fn {function} callback
	* @param: sid {string} cookie string
	* @API: public
	*/

	mysqlStore.prototype.destroy = function(sid, fn){		
		sid = this.prefix + sid;
		//this.client.connect();
		this.client.query("DELETE sID, data FROM " + this.table + ' WHERE sID = ?', [sID], function(err){
			if (err) {console.error(err)};
			fn();
		});
	};

	return mysqlStore;
}