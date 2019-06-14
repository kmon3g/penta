Connect-Mysql
=============

Mysql session store for Connect,
Pretty much the same as connect-redis, except slower.
<br />

###I suggest using redis as it's alot faster.

Only use this if you cant install redis or mongodb and you have mysql installed, of if you just want to try it out :)


[connect-redis](https://github.com/visionmedia/connect-redis)


============

###Options
<ul>
	<li> table: the table you want the sessions to save in. </li>
	<li> host: The database host (usually localhost). </li>
	<li> database: the database you are going to use. </li>
	<li> user: the username for the user you are using. </li>
	<li> pass: the password for that user. </li>
	<li> prefix: the prefix you will use for the id of the sessions. </li>
</ul>

####this is only for express 4.x.x


=============

If you find an issue, please file a error in the issues [here](https://github.com/Ryanc1256/connect-mysql/issues)


**Creator:** Ryan Clough 100%
