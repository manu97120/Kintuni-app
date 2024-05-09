CREATE TABLE horoscopes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    date DATE NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    house_system VARCHAR(255) NOT NULL,
    zodiac_system VARCHAR(255) NOT NULL,
    language VARCHAR(255) NOT NULL,
    aspect_levels JSONB NOT NULL,
    custom_orbs JSONB NOT NULL
);