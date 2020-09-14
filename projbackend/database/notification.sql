create table notifications(
    id serial primary key,
    notification_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ambulance_route_id int references ambulanceroutes(id),
    officer_id int references trafficofficers(id),
    isNotificationRead boolean
)