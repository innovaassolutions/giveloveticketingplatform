USE NS demo DB organiser_1;

DEFINE TABLE organiser SCHEMAFULL;
DEFINE FIELD name ON organiser TYPE string;

DEFINE TABLE user SCHEMAFULL;
DEFINE FIELD email ON user TYPE string;
DEFINE FIELD name ON user TYPE string;

DEFINE TABLE venue SCHEMAFULL;
DEFINE FIELD name ON venue TYPE string;
DEFINE FIELD address ON venue TYPE object;

DEFINE TABLE event SCHEMAFULL;
DEFINE FIELD organiser_id ON event TYPE record<organiser>;
DEFINE FIELD venue_id ON event TYPE record<venue>;
DEFINE FIELD name ON event TYPE string;
DEFINE FIELD start_time ON event TYPE datetime;
DEFINE FIELD end_time ON event TYPE datetime;
DEFINE FIELD status ON event TYPE string DEFAULT 'published';

DEFINE TABLE ticket_type SCHEMAFULL;
DEFINE FIELD event_id ON ticket_type TYPE record<event>;
DEFINE FIELD name ON ticket_type TYPE string;
DEFINE FIELD price_cents ON ticket_type TYPE number;
DEFINE FIELD currency ON ticket_type TYPE string;
DEFINE FIELD quantity_total ON ticket_type TYPE number;
DEFINE FIELD quantity_sold ON ticket_type TYPE number DEFAULT 0;

DEFINE TABLE order SCHEMAFULL;
DEFINE FIELD user_id ON order TYPE record<user>;
DEFINE FIELD tickets ON order TYPE array;
DEFINE FIELD total_cents ON order TYPE number;
DEFINE FIELD status ON order TYPE string DEFAULT 'pending';

DEFINE TABLE ticket SCHEMAFULL;
DEFINE FIELD ticket_type_id ON ticket TYPE record<ticket_type>;
DEFINE FIELD owner_user_id ON ticket TYPE record<user>;
DEFINE FIELD status ON ticket TYPE string DEFAULT 'sold';
DEFINE FIELD qr_hash ON ticket TYPE string;

DEFINE INDEX idx_ticket_qr ON TABLE ticket COLUMNS qr_hash UNIQUE;

-- seed: organiser, venue, event, ticket types
CREATE organiser:innovaas SET name = 'Innovaas Live';
CREATE venue:klcc SET name = 'KLCC Arena', address = { city: 'Kuala Lumpur', country: 'MY' };
CREATE event:gaga SET organiser_id = organiser:innovaas, venue_id = venue:klcc,
  name = 'Lady Gaga — One Night in KL', start_time = time::now(), end_time = <datetime>"2024-12-31T23:59:59Z", status = 'published';
CREATE ticket_type:ga SET event_id = event:gaga, name = 'GA', price_cents = 10000, currency = 'MYR', quantity_total = 1000;
CREATE ticket_type:vip SET event_id = event:gaga, name = 'VIP', price_cents = 25000, currency = 'MYR', quantity_total = 100;