#criando o banco de dados
create database if not exists blockfi;

#usando o banco de dados
use blockfi;

#criando a tabela grupos
create table grupos
(
    id        int auto_increment primary key,
    nome      varchar(30)                               not null,
    descricao varchar(60)                               not null,
    status    enum ('Ativo', 'Inativo') default 'Ativo' not null
);

#populando a tabela grupos
insert into grupos (nome, descricao, status)
values ('SysAdmin', 'Administradores do Sistema', 'Ativo'),
       ('Gestor', 'Gestores do Sistema', 'Ativo'),
       ('Usuário', 'Usuários do Sistema', 'Ativo');

#criando a tabela de usuários
create table usuarios
(
    id        int auto_increment primary key,
    nome      varchar(40)  not null,
    sobrenome varchar(40)  not null,
    email     varchar(60)  not null,
    senha     varchar(256) not null,
    grupo_id  int          not null,
    constraint usuarios_grupo_id_foreign
        foreign key (grupo_id) references grupos (id)
);

#populando a tabela usuários (usuario:edgard@gmail.com, senha: testando)
insert into usuarios (nome, sobrenome, email, senha, grupo_id)
VALUES ('Edgard', 'Oliveira', 'edgard@gmail.com', '$2a$12$k6bRU.J30SJ4lsja0wO72uhMzjWarQ6v5Y9Ea8dzTXhYAEF0B3SRC', 1);

#criando o banco de dados
create table redes
(
    id        int auto_increment primary key,
    ssid      varchar(40)                     not null,
    descricao varchar(40)                     not null,
    status    enum ('Permitido', 'Bloqueado') not null
);

#populando a tabela de rede
INSERT INTO redes (ssid, descricao, status)
VALUES ('AndroidWifi', 'Rede Wifi do AVD', 'Permitido'),
       ('Ciclopes', 'Rede dos ciclopes', 'Bloqueado');