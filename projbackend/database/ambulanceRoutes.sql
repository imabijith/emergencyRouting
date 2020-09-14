create table ambulanceroutes(
    id serial primary key,
    incident_id varchar(50) not null,
    route_type varchar(50) not null, 
    ambulance_route geometry not null,
    ambulance_route_buffer geometry,
    start_location geometry not null,
    end_location geometry not null,
    current_location geometry,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isEnded boolean DEFAULT FALSE
)