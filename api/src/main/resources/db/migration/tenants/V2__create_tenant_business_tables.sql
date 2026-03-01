CREATE TABLE raw_material (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(1000),
    unit VARCHAR(50),
    fractionable BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE raw_material_packaging (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    raw_material_id BIGINT NOT NULL,
    quantity_inside NUMERIC(19, 4) NOT NULL,
    current_stock INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT fk_packaging_raw_material FOREIGN KEY (raw_material_id) REFERENCES raw_material(id)
);

CREATE TABLE raw_material_packaging_transaction (
    id BIGSERIAL PRIMARY KEY,
    packaging_id BIGINT NOT NULL,
    quantity INTEGER NOT NULL,
    type VARCHAR(50) NOT NULL,
    transaction_date TIMESTAMP NOT NULL,
    note VARCHAR(500),
    CONSTRAINT fk_transaction_packaging FOREIGN KEY (packaging_id) REFERENCES raw_material_packaging(id)
);

CREATE TABLE product (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    price NUMERIC(19, 2) NOT NULL,
    fractionable BOOLEAN NOT NULL DEFAULT FALSE,
    current_stock NUMERIC(19, 4) NOT NULL DEFAULT 0
);

CREATE TABLE product_raw_material (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    raw_material_id BIGINT NOT NULL,
    quantity_needed NUMERIC(19, 4) NOT NULL,
    CONSTRAINT fk_prm_product FOREIGN KEY (product_id) REFERENCES product(id),
    CONSTRAINT fk_prm_raw_material FOREIGN KEY (raw_material_id) REFERENCES raw_material(id)
);

CREATE TABLE product_transaction (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    quantity NUMERIC(19, 4) NOT NULL,
    type VARCHAR(50) NOT NULL,
    transaction_date TIMESTAMP NOT NULL,
    note VARCHAR(500),
    CONSTRAINT fk_transaction_product FOREIGN KEY (product_id) REFERENCES product(id)
);