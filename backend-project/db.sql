CREATE DATABASE meeting_room_booking_system DEFAULT CHARACTER SET utf8mb4;


INSERT INTO meeting_room_booking_system.permissions (code,description) VALUES
	 ('ccc','访问 ccc 接口'),
	 ('ddd','访问 ddd 接口');

INSERT INTO meeting_room_booking_system.role_permission (rolesId,permissionsId) VALUES
	 (1,1),
	 (1,2),
	 (2,1);

INSERT INTO meeting_room_booking_system.roles (name) VALUES
	 ('管理员'),
	 ('普通用户');

INSERT INTO meeting_room_booking_system.user_roles (usersId,rolesId) VALUES
	 (2,1),
	 (3,2);

INSERT INTO meeting_room_booking_system.users (username,password,nick_name,email,headPic,phoneNumber,isFrozen,isAdmin,createTime,updateTime) VALUES
	 ('123','e10adc3949ba59abbe56e057f20f883e','tt','xxxxxx@xx.com',NULL,NULL,0,0,'2024-05-21 11:53:59.441919','2024-05-21 11:53:59.441919'),
	 ('zhangsan','96e79218965eb72c92a549dd5a330112','张三','xxx@xx.com',NULL,'13233323333',0,1,'2024-05-22 10:28:06.748645','2024-05-22 10:28:06.748645'),
	 ('lisi','e3ceb5881a0a1fdaad01296d7554868d','李四','yy@yy.com',NULL,NULL,0,0,'2024-05-22 10:28:06.758034','2024-05-22 10:28:06.758034');
