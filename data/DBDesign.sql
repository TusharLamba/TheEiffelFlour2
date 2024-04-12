-- insert trigger
CREATE OR REPLACE FUNCTION generate_product_id()
    RETURNS TRIGGER AS
$$
DECLARE
	serial_no INT;
BEGIN
    serial_no := (SELECT MAX(substr(product_id, 7, 3)::int)+1 FROM product
 	  WHERE substr(product_id, 1, 2) = NEW.category_code);
	  
	IF serial_no IS NULL THEN
        serial_no := 1;
    END IF;
	  
    NEW.product_id := CONCAT(
        NEW.category_code,
		LPAD(NEW.size::TEXT, 4, '0'),
        LPAD(serial_no::TEXT, 3, '0')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_product_id
BEFORE INSERT ON product
FOR EACH ROW
EXECUTE FUNCTION generate_product_id();

-- Update trigger
CREATE OR REPLACE FUNCTION update_product_id()
    RETURNS TRIGGER AS
$$
BEGIN 
	IF NEW.category_code <> OLD.category_code OR OLD.category_code IS NULL THEN
	    NEW.product_id := CONCAT(
		    NEW.category_code,
			SUBSTRING(NEW.product_id FROM 3)
		);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_product_id
BEFORE UPDATE ON product
FOR EACH ROW
EXECUTE FUNCTION update_product_id();

-- setting date fields ---

CREATE OR REPLACE FUNCTION set_dates()
    RETURNS TRIGGER AS
$$
BEGIN
    NEW.modified_date := CURRENT_DATE;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_dates_product
BEFORE UPDATE ON product
FOR EACH ROW
EXECUTE FUNCTION set_dates();



ALTER TABLE "users" RENAME to "customer";
ALTER TABLE customer DROP username;
ALTER TABLE customer DROP "password";
ALTER TABLE customer DROP "role";
ALTER TABLE customer RENAME "Id" TO "customer_id";
ALTER TABLE customer ADD COLUMN "customer_name" varchar(80);
ALTER TABLE customer ADD COLUMN date_of_birth DATE;
ALTER TABLE customer ADD COLUMN street TEXT;
ALTER TABLE customer ADD COLUMN city varchar(40);
ALTER TABLE customer ADD COLUMN "state" varchar(40);
ALTER TABLE customer ADD COLUMN country varchar(40);

ALTER TABLE customer ADD CONSTRAINT proper_email CHECK (email ~* '^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$');
ALTER TABLE customer ALTER COLUMN country SET DEFAULT 'India';

CREATE TABLE Product (
	product_id varchar(10) PRIMARY KEY,
	product_name varchar(40) NOT NULL,
	description varchar(100) NOT NULL,
	max_qty smallint,
	available boolean DEFAULT True,
	size smallint NOT NULL,
	category_code varchar(10) NOT NULL
);

-- Add dates columns
ALTER TABLE product ADD COLUMN date_added date DEFAULT CURRENT_DATE;
ALTER TABLE product ADD COLUMN modified_date date DEFAULT CURRENT_DATE;
ALTER TABLE product ADD COLUMN price numeric(6,2) NOT NULL DEFAULT 0.00;
ALTER TABLE product ADD CONSTRAINT name_price_unique UNIQUE(product_name, price);

INSERT INTO Product (
	product_name,
	description,
	max_qty,
	size,
	category_code
) VALUES (
	'Red Velvet Tea Cake',
	'Delicious yet airy Tea cakes',
	10,
	500,
	'TC'
);

CREATE TABLE "user" (
	username varchar(20) PRIMARY KEY,
	"password" varchar(300) NOT NULL,
	email varchar(100) NOT NULL,
	role varchar(40) DEFAULT 'User'
);

ALTER TABLE "user" ADD COLUMN created_at date DEFAULT CURRENT_DATE;
ALTER TABLE "user" DROP CONSTRAINT user_email_fkey;


select * from "product";

UPDATE product SET category_code = 'BD' where category_code = 'BR';



	
	



