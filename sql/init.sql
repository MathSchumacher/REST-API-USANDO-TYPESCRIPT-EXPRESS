-- Ativa a extensão para gerar UUIDs, se ainda não estiver ativada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Cria a tabela de usuários
CREATE TABLE IF NOT EXISTS application_user (
    uuid UUID DEFAULT uuid_generate_v4(),
    username VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    PRIMARY KEY (uuid)
);

-- Insere um usuário com senha criptografada
INSERT INTO application_user (username, password) 
VALUES ('Matheus Schumacher', crypt('admin', gen_salt('bf')));
