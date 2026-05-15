-- CreateTable
CREATE TABLE "City" (
    "city_id" TEXT NOT NULL PRIMARY KEY,
    "city_name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Flight" (
    "flight_id" TEXT NOT NULL PRIMARY KEY,
    "from_city_id" TEXT NOT NULL,
    "to_city_id" TEXT NOT NULL,
    "departure_time" DATETIME NOT NULL,
    "arrival_time" DATETIME NOT NULL,
    "price" REAL NOT NULL,
    "seats_total" INTEGER NOT NULL,
    "seats_available" INTEGER NOT NULL,
    CONSTRAINT "Flight_from_city_id_fkey" FOREIGN KEY ("from_city_id") REFERENCES "City" ("city_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Flight_to_city_id_fkey" FOREIGN KEY ("to_city_id") REFERENCES "City" ("city_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Ticket" (
    "ticket_id" TEXT NOT NULL PRIMARY KEY,
    "passenger_name" TEXT NOT NULL,
    "passenger_surname" TEXT NOT NULL,
    "passenger_email" TEXT NOT NULL,
    "seat_number" TEXT,
    "flight_id" TEXT NOT NULL,
    CONSTRAINT "Ticket_flight_id_fkey" FOREIGN KEY ("flight_id") REFERENCES "Flight" ("flight_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "City_city_name_key" ON "City"("city_name");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");
