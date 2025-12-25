-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.accounts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type character varying NOT NULL,
  provider character varying NOT NULL,
  provider_account_id character varying NOT NULL,
  refresh_token text,
  access_token text,
  expires_at integer,
  token_type character varying,
  scope text,
  id_token text,
  session_state text,
  created_at timestamp without time zone NOT NULL DEFAULT now(),
  updated_at timestamp without time zone NOT NULL DEFAULT now(),
  CONSTRAINT accounts_pkey PRIMARY KEY (id),
  CONSTRAINT accounts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.admin_users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email character varying NOT NULL UNIQUE,
  password character varying NOT NULL,
  name character varying NOT NULL DEFAULT 'Admin'::character varying,
  created_at timestamp without time zone NOT NULL DEFAULT now(),
  updated_at timestamp without time zone NOT NULL DEFAULT now(),
  CONSTRAINT admin_users_pkey PRIMARY KEY (id)
);
CREATE TABLE public.carousel_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  image text NOT NULL,
  title character varying NOT NULL,
  description text DEFAULT ''::text,
  order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  cloudinary_public_id character varying NOT NULL DEFAULT ''::character varying,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT carousel_items_pkey PRIMARY KEY (id)
);
CREATE TABLE public.contacts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  seller_email character varying NOT NULL,
  message text NOT NULL,
  status character varying NOT NULL DEFAULT 'pending'::character varying,
  created_at timestamp without time zone NOT NULL DEFAULT now(),
  updated_at timestamp without time zone NOT NULL DEFAULT now(),
  CONSTRAINT contacts_pkey PRIMARY KEY (id)
);
CREATE TABLE public.messages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  seller_id uuid NOT NULL,
  sender_type character varying NOT NULL CHECK (sender_type::text = ANY (ARRAY['user'::character varying, 'seller'::character varying]::text[])),
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT messages_pkey PRIMARY KEY (id),
  CONSTRAINT messages_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT messages_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.sellers(id)
);
CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  recipient_id uuid NOT NULL,
  recipient_type character varying NOT NULL CHECK (recipient_type::text = ANY (ARRAY['user'::character varying, 'seller'::character varying]::text[])),
  type character varying NOT NULL,
  title character varying NOT NULL,
  message text NOT NULL,
  related_id uuid,
  related_type character varying,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT notifications_pkey PRIMARY KEY (id)
);
CREATE TABLE public.products (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL,
  name character varying NOT NULL,
  description text NOT NULL DEFAULT ''::text,
  price numeric NOT NULL,
  offer_price numeric NOT NULL DEFAULT 0,
  quantity integer NOT NULL DEFAULT 0,
  category character varying NOT NULL DEFAULT ''::character varying,
  brand character varying NOT NULL DEFAULT ''::character varying,
  sku character varying UNIQUE,
  status character varying NOT NULL DEFAULT 'active'::character varying,
  images jsonb NOT NULL DEFAULT '[]'::jsonb,
  weight numeric NOT NULL DEFAULT 0,
  dimensions character varying NOT NULL DEFAULT ''::character varying,
  tags jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamp without time zone NOT NULL DEFAULT now(),
  updated_at timestamp without time zone NOT NULL DEFAULT now(),
  google_maps_url text,
  latitude numeric,
  longitude numeric,
  CONSTRAINT products_pkey PRIMARY KEY (id),
  CONSTRAINT products_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.sellers(id)
);
CREATE TABLE public.review_helpful (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  review_id uuid NOT NULL,
  user_id uuid NOT NULL,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT review_helpful_pkey PRIMARY KEY (id),
  CONSTRAINT review_helpful_review_id_fkey FOREIGN KEY (review_id) REFERENCES public.reviews(id),
  CONSTRAINT review_helpful_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.review_images (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  review_id uuid NOT NULL,
  image_url text NOT NULL,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT review_images_pkey PRIMARY KEY (id),
  CONSTRAINT review_images_review_id_fkey FOREIGN KEY (review_id) REFERENCES public.reviews(id)
);
CREATE TABLE public.reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL,
  user_id uuid NOT NULL,
  seller_id uuid NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title character varying,
  comment text,
  helpful_count integer NOT NULL DEFAULT 0 CHECK (helpful_count >= 0),
  verified_purchase boolean NOT NULL DEFAULT false,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT reviews_pkey PRIMARY KEY (id),
  CONSTRAINT reviews_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id),
  CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT reviews_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.sellers(id)
);
CREATE TABLE public.seller_verification_codes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email character varying NOT NULL,
  code character varying NOT NULL,
  expires_at timestamp without time zone NOT NULL,
  used boolean DEFAULT false,
  created_at timestamp without time zone NOT NULL DEFAULT now(),
  CONSTRAINT seller_verification_codes_pkey PRIMARY KEY (id)
);
CREATE TABLE public.sellers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email character varying NOT NULL UNIQUE,
  password text NOT NULL,
  shop_owner_name character varying NOT NULL,
  contact character varying NOT NULL,
  gender character varying NOT NULL,
  permanent_address text NOT NULL,
  permanent_address_url text NOT NULL,
  id_proof_url text NOT NULL,
  shop_name character varying NOT NULL,
  shop_contact_number character varying NOT NULL,
  address text NOT NULL,
  country character varying NOT NULL,
  country_code character varying NOT NULL,
  state character varying NOT NULL,
  state_code character varying NOT NULL,
  city character varying NOT NULL,
  shop_id_url text NOT NULL,
  email_verified boolean DEFAULT false,
  verified_at timestamp without time zone,
  status character varying DEFAULT 'pending'::character varying,
  created_at timestamp without time zone NOT NULL DEFAULT now(),
  updated_at timestamp without time zone NOT NULL DEFAULT now(),
  CONSTRAINT sellers_pkey PRIMARY KEY (id)
);
CREATE TABLE public.sessions (
  session_token character varying NOT NULL,
  user_id uuid NOT NULL,
  expires timestamp without time zone NOT NULL,
  created_at timestamp without time zone NOT NULL DEFAULT now(),
  CONSTRAINT sessions_pkey PRIMARY KEY (session_token),
  CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying,
  email character varying NOT NULL UNIQUE,
  email_verified timestamp without time zone,
  image text,
  provider character varying DEFAULT 'google'::character varying,
  provider_id character varying,
  created_at timestamp without time zone NOT NULL DEFAULT now(),
  updated_at timestamp without time zone NOT NULL DEFAULT now(),
  country character varying,
  state character varying,
  city character varying,
  location_set boolean DEFAULT false,
  country_code character varying,
  state_code character varying,
  address text,
  has_completed_profile boolean DEFAULT false,
  CONSTRAINT users_pkey PRIMARY KEY (id)
);
CREATE TABLE public.verification_tokens (
  identifier character varying NOT NULL,
  token character varying NOT NULL UNIQUE,
  expires timestamp without time zone NOT NULL,
  CONSTRAINT verification_tokens_pkey PRIMARY KEY (identifier, token)
);
CREATE TABLE public.wishlists (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  product_id uuid NOT NULL,
  created_at timestamp without time zone NOT NULL DEFAULT now(),
  CONSTRAINT wishlists_pkey PRIMARY KEY (id),
  CONSTRAINT wishlists_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT wishlists_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);