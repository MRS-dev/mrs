-- Migration pour ajouter les colonnes weight et height à la table patients
ALTER TABLE patients 
ADD COLUMN weight TEXT,
ADD COLUMN height TEXT;