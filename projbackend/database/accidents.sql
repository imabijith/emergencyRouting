create table accidents(
    id serial primary key,
    station_id int references trafficoffices(gid), 
    ambulance_route_id int references ambulanceroutes(id),
    accident_location geometry not null,
    hospital_location geometry,
    reported_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isRead boolean DEFAULT false
)