--
-- PostgreSQL database dump
--

\restrict gYvvZAwMSFGYw5kY9nh4bZDsKhiarXLTysEXO6U8lIJ0QLhVGjapQ0lXrRqiGOC

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

-- Started on 2026-11-15 18:00:17

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 5488 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 248 (class 1259 OID 26100)
-- Name: account_vouchers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account_vouchers (
    id integer NOT NULL,
    company_id character varying(50) DEFAULT 'comp_mann'::character varying NOT NULL,
    account_id integer,
    voucher_no character varying(100) NOT NULL,
    voucher_date date DEFAULT CURRENT_DATE NOT NULL,
    voucher_type character varying(50) NOT NULL,
    narration text DEFAULT ''::text,
    debit_amount numeric(15,2) DEFAULT 0.00 NOT NULL,
    credit_amount numeric(15,2) DEFAULT 0.00 NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.account_vouchers OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 26099)
-- Name: account_vouchers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.account_vouchers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.account_vouchers_id_seq OWNER TO postgres;

--
-- TOC entry 5489 (class 0 OID 0)
-- Dependencies: 247
-- Name: account_vouchers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.account_vouchers_id_seq OWNED BY public.account_vouchers.id;


--
-- TOC entry 258 (class 1259 OID 26248)
-- Name: branch_shrink_benchmarks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.branch_shrink_benchmarks (
    id integer NOT NULL,
    company_id character varying(50) DEFAULT 'comp_mann'::character varying NOT NULL,
    branch_code character varying(50) NOT NULL,
    branch_name character varying(255) NOT NULL,
    monthly_turnover numeric(15,2) DEFAULT 0.00 NOT NULL,
    variance_value numeric(12,2) DEFAULT 0.00 NOT NULL,
    shrink_rate_percent numeric(5,2) DEFAULT 0.00 NOT NULL,
    peer_benchmark character varying(100) DEFAULT '< 0.80% Target'::character varying NOT NULL,
    grade character varying(50) DEFAULT 'Grade A+ (Exemplary)'::character varying NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.branch_shrink_benchmarks OWNER TO postgres;

--
-- TOC entry 257 (class 1259 OID 26247)
-- Name: branch_shrink_benchmarks_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.branch_shrink_benchmarks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.branch_shrink_benchmarks_id_seq OWNER TO postgres;

--
-- TOC entry 5490 (class 0 OID 0)
-- Dependencies: 257
-- Name: branch_shrink_benchmarks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.branch_shrink_benchmarks_id_seq OWNED BY public.branch_shrink_benchmarks.id;


--
-- TOC entry 244 (class 1259 OID 26043)
-- Name: branch_stock; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.branch_stock (
    id integer NOT NULL,
    company_id character varying(50) DEFAULT 'comp_mann'::character varying NOT NULL,
    branch_code character varying(50) NOT NULL,
    pid character varying(100) NOT NULL,
    current_stock numeric(12,2) DEFAULT 0,
    min_stock numeric(12,2) DEFAULT 10,
    status character varying(50) DEFAULT 'OK'::character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.branch_stock OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 26042)
-- Name: branch_stock_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.branch_stock_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.branch_stock_id_seq OWNER TO postgres;

--
-- TOC entry 5491 (class 0 OID 0)
-- Dependencies: 243
-- Name: branch_stock_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.branch_stock_id_seq OWNED BY public.branch_stock.id;


--
-- TOC entry 238 (class 1259 OID 25909)
-- Name: branches; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.branches (
    id integer NOT NULL,
    company_id character varying(50) DEFAULT 'comp_mann'::character varying NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(255) NOT NULL,
    city character varying(100) NOT NULL,
    state character varying(100) DEFAULT 'Gujarat'::character varying,
    type character varying(50) DEFAULT 'BRANCH_OFFICE'::character varying,
    latitude numeric(10,6) DEFAULT 23.0225 NOT NULL,
    longitude numeric(10,6) DEFAULT 72.5714 NOT NULL,
    status character varying(50) DEFAULT 'Active'::character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    address text DEFAULT ''::text,
    phone character varying(50) DEFAULT ''::character varying,
    email character varying(150) DEFAULT ''::character varying,
    gstin character varying(50) DEFAULT ''::character varying
);


ALTER TABLE public.branches OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 25908)
-- Name: branches_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.branches_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.branches_id_seq OWNER TO postgres;

--
-- TOC entry 5492 (class 0 OID 0)
-- Dependencies: 237
-- Name: branches_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.branches_id_seq OWNED BY public.branches.id;


--
-- TOC entry 236 (class 1259 OID 25869)
-- Name: cash_book; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cash_book (
    id integer NOT NULL,
    company_id character varying(50) DEFAULT 'comp_mann'::character varying NOT NULL,
    branch_code character varying(50) DEFAULT 'AMD-01'::character varying NOT NULL,
    entry_no character varying(50) NOT NULL,
    entry_date date DEFAULT CURRENT_DATE NOT NULL,
    type character varying(50) DEFAULT 'Receipt'::character varying NOT NULL,
    party character varying(255) NOT NULL,
    category character varying(100) DEFAULT 'Counter Sales'::character varying,
    ref_no character varying(100) DEFAULT ''::character varying,
    narration text DEFAULT ''::text,
    dr_amount numeric(14,2) DEFAULT 0 NOT NULL,
    cr_amount numeric(14,2) DEFAULT 0 NOT NULL,
    balance numeric(14,2) DEFAULT 0 NOT NULL,
    payment_mode character varying(50) DEFAULT 'Cash'::character varying,
    reconciled boolean DEFAULT false,
    created_by character varying(100) DEFAULT 'Admin'::character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.cash_book OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 25868)
-- Name: cash_book_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cash_book_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cash_book_id_seq OWNER TO postgres;

--
-- TOC entry 5493 (class 0 OID 0)
-- Dependencies: 235
-- Name: cash_book_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cash_book_id_seq OWNED BY public.cash_book.id;


--
-- TOC entry 228 (class 1259 OID 25710)
-- Name: cat_sub; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cat_sub (
    id integer NOT NULL,
    tittle character varying(255) NOT NULL,
    sp_cat character varying(50) NOT NULL,
    type character varying(50) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.cat_sub OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 25709)
-- Name: cat_sub_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cat_sub_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cat_sub_id_seq OWNER TO postgres;

--
-- TOC entry 5494 (class 0 OID 0)
-- Dependencies: 227
-- Name: cat_sub_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cat_sub_id_seq OWNED BY public.cat_sub.id;


--
-- TOC entry 246 (class 1259 OID 26070)
-- Name: chart_of_accounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chart_of_accounts (
    id integer NOT NULL,
    company_id character varying(50) DEFAULT 'comp_mann'::character varying NOT NULL,
    name character varying(255) NOT NULL,
    nature character varying(50) NOT NULL,
    account_group character varying(100) DEFAULT 'General'::character varying NOT NULL,
    opening_balance numeric(15,2) DEFAULT 0.00 NOT NULL,
    current_balance numeric(15,2) DEFAULT 0.00 NOT NULL,
    balance_type character varying(10) DEFAULT 'DR'::character varying NOT NULL,
    child_ledgers_count integer DEFAULT 1 NOT NULL,
    is_system_locked boolean DEFAULT false NOT NULL,
    notes text DEFAULT ''::text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.chart_of_accounts OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 26069)
-- Name: chart_of_accounts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.chart_of_accounts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.chart_of_accounts_id_seq OWNER TO postgres;

--
-- TOC entry 5495 (class 0 OID 0)
-- Dependencies: 245
-- Name: chart_of_accounts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.chart_of_accounts_id_seq OWNED BY public.chart_of_accounts.id;


--
-- TOC entry 259 (class 1259 OID 26319)
-- Name: companies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.companies (
    id character varying(100) NOT NULL,
    tenant_id character varying(100),
    name character varying(255) NOT NULL,
    legal_name character varying(255),
    gstin character varying(50),
    pan character varying(20),
    address text DEFAULT ''::text,
    pin_code character varying(20) DEFAULT ''::character varying,
    state character varying(100) DEFAULT ''::character varying,
    country character varying(100) DEFAULT 'India'::character varying,
    primary_color character varying(50) DEFAULT '#0284c7'::character varying,
    currency character varying(10) DEFAULT 'INR'::character varying,
    status character varying(50) DEFAULT 'ACTIVE'::character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.companies OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 25964)
-- Name: customer_holds; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer_holds (
    id integer NOT NULL,
    hold_no character varying(50) NOT NULL,
    company_id character varying(50) DEFAULT 'comp_mann'::character varying NOT NULL,
    branch_code character varying(50) DEFAULT 'AMD-01'::character varying NOT NULL,
    customer_name character varying(255) NOT NULL,
    customer_phone character varying(50) DEFAULT ''::character varying,
    customer_email character varying(150) DEFAULT ''::character varying,
    item_code character varying(100) NOT NULL,
    item_name character varying(255) NOT NULL,
    qty numeric(10,2) DEFAULT 1 NOT NULL,
    unit_price numeric(12,2) DEFAULT 0,
    total_amount numeric(14,2) DEFAULT 0,
    hold_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    expires_at timestamp with time zone DEFAULT (CURRENT_TIMESTAMP + '04:00:00'::interval),
    status character varying(50) DEFAULT 'ACTIVE'::character varying,
    invoice_no character varying(50) DEFAULT ''::character varying,
    notes text DEFAULT ''::text,
    created_by character varying(100) DEFAULT 'Staff'::character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.customer_holds OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 25963)
-- Name: customer_holds_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.customer_holds_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.customer_holds_id_seq OWNER TO postgres;

--
-- TOC entry 5496 (class 0 OID 0)
-- Dependencies: 239
-- Name: customer_holds_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.customer_holds_id_seq OWNED BY public.customer_holds.id;


--
-- TOC entry 222 (class 1259 OID 25538)
-- Name: customers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customers (
    id integer NOT NULL,
    uid character varying(50) NOT NULL,
    company character varying(255) NOT NULL,
    name character varying(255) DEFAULT ''::character varying,
    phone character varying(50) DEFAULT ''::character varying,
    email character varying(150) DEFAULT ''::character varying,
    address text DEFAULT ''::text,
    gstin character varying(50) DEFAULT ''::character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    company_id character varying(50) DEFAULT 'comp_mann'::character varying
);


ALTER TABLE public.customers OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 25537)
-- Name: customers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.customers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.customers_id_seq OWNER TO postgres;

--
-- TOC entry 5497 (class 0 OID 0)
-- Dependencies: 221
-- Name: customers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.customers_id_seq OWNED BY public.customers.id;


--
-- TOC entry 256 (class 1259 OID 26214)
-- Name: cycle_counts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cycle_counts (
    id integer NOT NULL,
    session_no character varying(100) NOT NULL,
    company_id character varying(50) DEFAULT 'comp_mann'::character varying NOT NULL,
    branch_code character varying(50) DEFAULT 'AMD-01'::character varying NOT NULL,
    count_mode character varying(50) DEFAULT 'Blind Count'::character varying NOT NULL,
    section character varying(100) NOT NULL,
    auditor_name character varying(100) NOT NULL,
    system_qty integer DEFAULT 0 NOT NULL,
    physical_qty integer DEFAULT 0 NOT NULL,
    variance_qty integer DEFAULT 0 NOT NULL,
    status character varying(50) DEFAULT 'Tallied ⚖️'::character varying NOT NULL,
    session_date date DEFAULT CURRENT_DATE NOT NULL,
    notes text DEFAULT ''::text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.cycle_counts OWNER TO postgres;

--
-- TOC entry 255 (class 1259 OID 26213)
-- Name: cycle_counts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cycle_counts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cycle_counts_id_seq OWNER TO postgres;

--
-- TOC entry 5498 (class 0 OID 0)
-- Dependencies: 255
-- Name: cycle_counts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cycle_counts_id_seq OWNED BY public.cycle_counts.id;


--
-- TOC entry 250 (class 1259 OID 26128)
-- Name: financial_periods; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.financial_periods (
    id integer NOT NULL,
    company_id character varying(50) DEFAULT 'comp_mann'::character varying NOT NULL,
    fiscal_year character varying(50) DEFAULT '2025–2026'::character varying NOT NULL,
    month_name character varying(50) NOT NULL,
    period_start date NOT NULL,
    period_end date NOT NULL,
    status character varying(20) DEFAULT 'Open'::character varying NOT NULL,
    vouchers_count integer DEFAULT 0 NOT NULL,
    locked_by character varying(100) DEFAULT '—'::character varying,
    locked_at timestamp with time zone,
    lock_hash character varying(255),
    notes text DEFAULT ''::text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.financial_periods OWNER TO postgres;

--
-- TOC entry 249 (class 1259 OID 26127)
-- Name: financial_periods_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.financial_periods_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.financial_periods_id_seq OWNER TO postgres;

--
-- TOC entry 5499 (class 0 OID 0)
-- Dependencies: 249
-- Name: financial_periods_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.financial_periods_id_seq OWNED BY public.financial_periods.id;


--
-- TOC entry 226 (class 1259 OID 25598)
-- Name: invoice_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invoice_items (
    id integer NOT NULL,
    invoice_id integer,
    invoice_no character varying(50) NOT NULL,
    item_code character varying(100) NOT NULL,
    item_name character varying(255) NOT NULL,
    unit character varying(50) DEFAULT 'NOS'::character varying,
    hsn_code character varying(50) DEFAULT ''::character varying,
    qty numeric(10,2) DEFAULT 1 NOT NULL,
    unit_price numeric(12,2) DEFAULT 0 NOT NULL,
    discount numeric(12,2) DEFAULT 0,
    effective_price numeric(12,2) DEFAULT 0,
    tax_rate numeric(5,2) DEFAULT 18,
    tax_amount numeric(12,2) DEFAULT 0,
    subtotal numeric(14,2) DEFAULT 0 NOT NULL,
    remark text DEFAULT ''::text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.invoice_items OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 25597)
-- Name: invoice_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.invoice_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.invoice_items_id_seq OWNER TO postgres;

--
-- TOC entry 5500 (class 0 OID 0)
-- Dependencies: 225
-- Name: invoice_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.invoice_items_id_seq OWNED BY public.invoice_items.id;


--
-- TOC entry 224 (class 1259 OID 25558)
-- Name: invoices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invoices (
    id integer NOT NULL,
    invoice_no character varying(50) NOT NULL,
    branch_code character varying(50) DEFAULT 'AMD-01'::character varying NOT NULL,
    customer_uid character varying(50) DEFAULT ''::character varying,
    customer_name character varying(255) NOT NULL,
    contact_person character varying(150) DEFAULT ''::character varying,
    customer_phone character varying(50) DEFAULT ''::character varying,
    customer_email character varying(150) DEFAULT ''::character varying,
    customer_address text DEFAULT ''::text,
    customer_gstin character varying(50) DEFAULT ''::character varying,
    invoice_date date DEFAULT CURRENT_DATE NOT NULL,
    due_date date,
    followup_by character varying(150) DEFAULT 'Admin'::character varying,
    reference_no character varying(100) DEFAULT ''::character varying,
    revision_no character varying(50) DEFAULT '1'::character varying,
    total_items integer DEFAULT 1,
    subtotal numeric(14,2) DEFAULT 0,
    total_tax numeric(14,2) DEFAULT 0,
    discount_amount numeric(14,2) DEFAULT 0,
    round_off numeric(8,2) DEFAULT 0,
    grand_total numeric(14,2) DEFAULT 0,
    payment_mode character varying(50) DEFAULT 'Cash'::character varying,
    status character varying(50) DEFAULT 'Posted'::character varying,
    quote_remark text DEFAULT ''::text,
    terms_conditions text DEFAULT ''::text,
    created_by character varying(100) DEFAULT 'Admin'::character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    company_id character varying(50) DEFAULT 'comp_mann'::character varying
);


ALTER TABLE public.invoices OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 25557)
-- Name: invoices_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.invoices_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.invoices_id_seq OWNER TO postgres;

--
-- TOC entry 5501 (class 0 OID 0)
-- Dependencies: 223
-- Name: invoices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.invoices_id_seq OWNED BY public.invoices.id;


--
-- TOC entry 252 (class 1259 OID 26154)
-- Name: loss_alerts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.loss_alerts (
    id integer NOT NULL,
    company_id character varying(50) DEFAULT 'comp_mann'::character varying NOT NULL,
    branch_code character varying(50) DEFAULT 'AMD-01'::character varying NOT NULL,
    title character varying(255) NOT NULL,
    description text NOT NULL,
    severity character varying(20) DEFAULT 'warning'::character varying NOT NULL,
    category character varying(100) DEFAULT 'TRANSFER_MISMATCH'::character varying NOT NULL,
    status character varying(30) DEFAULT 'ACTIVE'::character varying NOT NULL,
    incident_time character varying(100) DEFAULT 'Just now'::character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.loss_alerts OWNER TO postgres;

--
-- TOC entry 251 (class 1259 OID 26153)
-- Name: loss_alerts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.loss_alerts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.loss_alerts_id_seq OWNER TO postgres;

--
-- TOC entry 5502 (class 0 OID 0)
-- Dependencies: 251
-- Name: loss_alerts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.loss_alerts_id_seq OWNED BY public.loss_alerts.id;


--
-- TOC entry 220 (class 1259 OID 25495)
-- Name: product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product (
    id integer NOT NULL,
    branch_code character varying(50) DEFAULT 'AMD-01'::character varying NOT NULL,
    supplier character varying(255) DEFAULT 'General Supplier'::character varying,
    name character varying(255) NOT NULL,
    description text DEFAULT ''::text,
    weight character varying(100) DEFAULT '1 kg'::character varying,
    category character varying(100) DEFAULT 'Fire Extinguishers'::character varying,
    sub_category character varying(100) DEFAULT 'General'::character varying,
    pid character varying(100) NOT NULL,
    hsn character varying(50) DEFAULT '8424'::character varying,
    current_stock numeric(12,2) DEFAULT 0,
    min_stock numeric(12,2) DEFAULT 10,
    exp_months numeric(10,2) DEFAULT 12,
    sale_price numeric(12,2) DEFAULT 0,
    gst numeric(5,2) DEFAULT 18,
    purchase_price numeric(12,2) DEFAULT 0,
    total_without_tax numeric(14,2) DEFAULT 0,
    total_with_tax numeric(14,2) DEFAULT 0,
    exp_days integer DEFAULT 360,
    status character varying(50) DEFAULT 'OK'::character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    company_id character varying(50) DEFAULT 'comp_mann'::character varying,
    barcode character varying(100)
);


ALTER TABLE public.product OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 25494)
-- Name: product_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_id_seq OWNER TO postgres;

--
-- TOC entry 5503 (class 0 OID 0)
-- Dependencies: 219
-- Name: product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_id_seq OWNED BY public.product.id;


--
-- TOC entry 234 (class 1259 OID 25837)
-- Name: purchase_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.purchase_items (
    id integer NOT NULL,
    purchase_id integer,
    po_no character varying(50) NOT NULL,
    item_code character varying(100) NOT NULL,
    item_name character varying(255) NOT NULL,
    unit character varying(50) DEFAULT 'NOS'::character varying,
    hsn_code character varying(50) DEFAULT ''::character varying,
    qty numeric(10,2) DEFAULT 1 NOT NULL,
    unit_price numeric(12,2) DEFAULT 0 NOT NULL,
    discount numeric(12,2) DEFAULT 0,
    effective_price numeric(12,2) DEFAULT 0,
    tax_rate numeric(5,2) DEFAULT 18,
    tax_amount numeric(12,2) DEFAULT 0,
    subtotal numeric(14,2) DEFAULT 0 NOT NULL,
    remark text DEFAULT ''::text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.purchase_items OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 25836)
-- Name: purchase_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.purchase_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.purchase_items_id_seq OWNER TO postgres;

--
-- TOC entry 5504 (class 0 OID 0)
-- Dependencies: 233
-- Name: purchase_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.purchase_items_id_seq OWNED BY public.purchase_items.id;


--
-- TOC entry 232 (class 1259 OID 25795)
-- Name: purchases; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.purchases (
    id integer NOT NULL,
    po_no character varying(50) NOT NULL,
    company_id character varying(50) DEFAULT 'comp_mann'::character varying NOT NULL,
    branch_code character varying(50) DEFAULT 'AMD-01'::character varying NOT NULL,
    supplier_uid character varying(50) DEFAULT ''::character varying,
    supplier_name character varying(255) NOT NULL,
    contact_person character varying(150) DEFAULT ''::character varying,
    supplier_phone character varying(50) DEFAULT ''::character varying,
    supplier_email character varying(150) DEFAULT ''::character varying,
    supplier_address text DEFAULT ''::text,
    supplier_gstin character varying(50) DEFAULT ''::character varying,
    po_date date DEFAULT CURRENT_DATE NOT NULL,
    due_date date,
    delivery_date date,
    reference_no character varying(100) DEFAULT ''::character varying,
    revision_no character varying(50) DEFAULT '1'::character varying,
    total_items integer DEFAULT 1,
    subtotal numeric(14,2) DEFAULT 0,
    total_tax numeric(14,2) DEFAULT 0,
    discount_amount numeric(14,2) DEFAULT 0,
    round_off numeric(8,2) DEFAULT 0,
    grand_total numeric(14,2) DEFAULT 0,
    payment_terms character varying(50) DEFAULT 'Credit 30 Days'::character varying,
    status character varying(50) DEFAULT 'Ordered'::character varying,
    grn_no character varying(100) DEFAULT ''::character varying,
    po_remark text DEFAULT ''::text,
    terms_conditions text DEFAULT ''::text,
    created_by character varying(100) DEFAULT 'Admin'::character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.purchases OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 25794)
-- Name: purchases_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.purchases_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.purchases_id_seq OWNER TO postgres;

--
-- TOC entry 5505 (class 0 OID 0)
-- Dependencies: 231
-- Name: purchases_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.purchases_id_seq OWNED BY public.purchases.id;


--
-- TOC entry 254 (class 1259 OID 26179)
-- Name: stock_adjustments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock_adjustments (
    id integer NOT NULL,
    adjustment_no character varying(100) NOT NULL,
    company_id character varying(50) DEFAULT 'comp_mann'::character varying NOT NULL,
    branch_code character varying(50) DEFAULT 'AMD-01'::character varying NOT NULL,
    item_name character varying(255) NOT NULL,
    sku character varying(100) NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    loss_value numeric(12,2) DEFAULT 0.00 NOT NULL,
    reason_code character varying(100) NOT NULL,
    requested_by character varying(100) NOT NULL,
    request_date date DEFAULT CURRENT_DATE NOT NULL,
    photo_evidence boolean DEFAULT true NOT NULL,
    photo_url text DEFAULT ''::text,
    status character varying(30) DEFAULT 'PENDING'::character varying NOT NULL,
    reviewed_by character varying(100),
    reviewed_at timestamp with time zone,
    review_notes text DEFAULT ''::text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.stock_adjustments OWNER TO postgres;

--
-- TOC entry 253 (class 1259 OID 26178)
-- Name: stock_adjustments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.stock_adjustments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.stock_adjustments_id_seq OWNER TO postgres;

--
-- TOC entry 5506 (class 0 OID 0)
-- Dependencies: 253
-- Name: stock_adjustments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.stock_adjustments_id_seq OWNED BY public.stock_adjustments.id;


--
-- TOC entry 242 (class 1259 OID 25998)
-- Name: stock_transfers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock_transfers (
    id integer NOT NULL,
    transfer_no character varying(50) NOT NULL,
    company_id character varying(50) DEFAULT 'comp_mann'::character varying NOT NULL,
    from_branch character varying(50) NOT NULL,
    to_branch character varying(50) NOT NULL,
    item_code character varying(100) NOT NULL,
    item_name character varying(255) NOT NULL,
    qty numeric(10,2) DEFAULT 1 NOT NULL,
    unit_price numeric(12,2) DEFAULT 0,
    total_value numeric(14,2) DEFAULT 0,
    vehicle_no character varying(100) DEFAULT 'GJ-01-TR-4501'::character varying,
    driver_name character varying(150) DEFAULT 'Ramesh Patel'::character varying,
    driver_phone character varying(50) DEFAULT '+91 98250 12345'::character varying,
    status character varying(50) DEFAULT 'In Transit'::character varying,
    transfer_date date DEFAULT CURRENT_DATE NOT NULL,
    received_date timestamp with time zone,
    dispatch_notes text DEFAULT ''::text,
    received_notes text DEFAULT ''::text,
    created_by character varying(100) DEFAULT 'Admin'::character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.stock_transfers OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 25997)
-- Name: stock_transfers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.stock_transfers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.stock_transfers_id_seq OWNER TO postgres;

--
-- TOC entry 5507 (class 0 OID 0)
-- Dependencies: 241
-- Name: stock_transfers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.stock_transfers_id_seq OWNED BY public.stock_transfers.id;


--
-- TOC entry 230 (class 1259 OID 25727)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    user_id character varying(50) NOT NULL,
    username character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    password_hash character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    role character varying(50) NOT NULL,
    branch_code character varying(50) NOT NULL,
    branch_name character varying(150) NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    company_id character varying(50) DEFAULT 'comp_mann'::character varying,
    company_name character varying(255) DEFAULT 'Mann Engineers Fire Safety'::character varying,
    phone character varying(50) DEFAULT ''::character varying,
    designation character varying(100) DEFAULT 'Staff'::character varying,
    department character varying(100) DEFAULT 'Operations'::character varying,
    salary numeric(12,2) DEFAULT 0,
    joining_date date DEFAULT CURRENT_DATE,
    failed_attempts integer DEFAULT 0,
    locked_until timestamp with time zone,
    status character varying(50) DEFAULT 'ACTIVE'::character varying
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 25726)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 5508 (class 0 OID 0)
-- Dependencies: 229
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 5152 (class 2604 OID 26103)
-- Name: account_vouchers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_vouchers ALTER COLUMN id SET DEFAULT nextval('public.account_vouchers_id_seq'::regclass);


--
-- TOC entry 5198 (class 2604 OID 26251)
-- Name: branch_shrink_benchmarks id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branch_shrink_benchmarks ALTER COLUMN id SET DEFAULT nextval('public.branch_shrink_benchmarks_id_seq'::regclass);


--
-- TOC entry 5134 (class 2604 OID 26046)
-- Name: branch_stock id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branch_stock ALTER COLUMN id SET DEFAULT nextval('public.branch_stock_id_seq'::regclass);


--
-- TOC entry 5090 (class 2604 OID 25912)
-- Name: branches id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branches ALTER COLUMN id SET DEFAULT nextval('public.branches_id_seq'::regclass);


--
-- TOC entry 5074 (class 2604 OID 25872)
-- Name: cash_book id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cash_book ALTER COLUMN id SET DEFAULT nextval('public.cash_book_id_seq'::regclass);


--
-- TOC entry 5022 (class 2604 OID 25713)
-- Name: cat_sub id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cat_sub ALTER COLUMN id SET DEFAULT nextval('public.cat_sub_id_seq'::regclass);


--
-- TOC entry 5141 (class 2604 OID 26073)
-- Name: chart_of_accounts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chart_of_accounts ALTER COLUMN id SET DEFAULT nextval('public.chart_of_accounts_id_seq'::regclass);


--
-- TOC entry 5103 (class 2604 OID 25967)
-- Name: customer_holds id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_holds ALTER COLUMN id SET DEFAULT nextval('public.customer_holds_id_seq'::regclass);


--
-- TOC entry 4976 (class 2604 OID 25541)
-- Name: customers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers ALTER COLUMN id SET DEFAULT nextval('public.customers_id_seq'::regclass);


--
-- TOC entry 5187 (class 2604 OID 26217)
-- Name: cycle_counts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cycle_counts ALTER COLUMN id SET DEFAULT nextval('public.cycle_counts_id_seq'::regclass);


--
-- TOC entry 5159 (class 2604 OID 26131)
-- Name: financial_periods id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.financial_periods ALTER COLUMN id SET DEFAULT nextval('public.financial_periods_id_seq'::regclass);


--
-- TOC entry 5010 (class 2604 OID 25601)
-- Name: invoice_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_items ALTER COLUMN id SET DEFAULT nextval('public.invoice_items_id_seq'::regclass);


--
-- TOC entry 4984 (class 2604 OID 25561)
-- Name: invoices id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices ALTER COLUMN id SET DEFAULT nextval('public.invoices_id_seq'::regclass);


--
-- TOC entry 5168 (class 2604 OID 26157)
-- Name: loss_alerts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loss_alerts ALTER COLUMN id SET DEFAULT nextval('public.loss_alerts_id_seq'::regclass);


--
-- TOC entry 4955 (class 2604 OID 25498)
-- Name: product id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product ALTER COLUMN id SET DEFAULT nextval('public.product_id_seq'::regclass);


--
-- TOC entry 5062 (class 2604 OID 25840)
-- Name: purchase_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_items ALTER COLUMN id SET DEFAULT nextval('public.purchase_items_id_seq'::regclass);


--
-- TOC entry 5036 (class 2604 OID 25798)
-- Name: purchases id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchases ALTER COLUMN id SET DEFAULT nextval('public.purchases_id_seq'::regclass);


--
-- TOC entry 5176 (class 2604 OID 26182)
-- Name: stock_adjustments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_adjustments ALTER COLUMN id SET DEFAULT nextval('public.stock_adjustments_id_seq'::regclass);


--
-- TOC entry 5119 (class 2604 OID 26001)
-- Name: stock_transfers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_transfers ALTER COLUMN id SET DEFAULT nextval('public.stock_transfers_id_seq'::regclass);


--
-- TOC entry 5024 (class 2604 OID 25730)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 5471 (class 0 OID 26100)
-- Dependencies: 248
-- Data for Name: account_vouchers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.account_vouchers (id, company_id, account_id, voucher_no, voucher_date, voucher_type, narration, debit_amount, credit_amount, created_at) FROM stdin;
1	comp_mann	1	VCH-1-01	2026-10-19	Receipt	Opening FY25 balance reconciliation for Capital Account	0.00	1500000.00	2026-10-24 17:40:31.382118+05:30
2	comp_mann	2	VCH-2-01	2026-10-19	Receipt	Opening FY25 balance reconciliation for Reserves & Surplus	0.00	345000.00	2026-10-24 17:40:31.382118+05:30
3	comp_mann	3	VCH-3-01	2026-10-19	Payment	Opening FY25 balance reconciliation for Current Assets - Cash	124500.00	0.00	2026-10-24 17:40:31.382118+05:30
4	comp_mann	4	VCH-4-01	2026-10-19	Payment	Opening FY25 balance reconciliation for Current Assets - Bank	845200.00	0.00	2026-10-24 17:40:31.382118+05:30
5	comp_mann	5	VCH-5-01	2026-10-19	Payment	Opening FY25 balance reconciliation for Sundry Debtors	678900.00	0.00	2026-10-24 17:40:31.382118+05:30
6	comp_mann	6	VCH-6-01	2026-10-19	Payment	Opening FY25 balance reconciliation for Stock-in-Hand	1456000.00	0.00	2026-10-24 17:40:31.382118+05:30
7	comp_mann	7	VCH-7-01	2026-10-19	Payment	Opening FY25 balance reconciliation for Fixed Assets	2240000.00	0.00	2026-10-24 17:40:31.382118+05:30
8	comp_mann	8	VCH-8-01	2026-10-19	Receipt	Opening FY25 balance reconciliation for Sundry Creditors	0.00	423100.00	2026-10-24 17:40:31.382118+05:30
9	comp_mann	9	VCH-9-01	2026-10-19	Receipt	Opening FY25 balance reconciliation for Duties & Taxes	0.00	187650.00	2026-10-24 17:40:31.382118+05:30
10	comp_mann	10	VCH-10-01	2026-10-19	Receipt	Opening FY25 balance reconciliation for Sales Accounts	0.00	4215000.00	2026-10-24 17:40:31.382118+05:30
11	comp_mann	11	VCH-11-01	2026-10-19	Payment	Opening FY25 balance reconciliation for Purchase Accounts	2890000.00	0.00	2026-10-24 17:40:31.382118+05:30
12	comp_mann	12	VCH-12-01	2026-10-19	Payment	Opening FY25 balance reconciliation for Indirect Expenses	567800.00	0.00	2026-10-24 17:40:31.382118+05:30
13	comp_mashtech	13	VCH-13-01	2026-10-19	Receipt	Opening FY25 balance reconciliation for Tech Capital Account	0.00	1200000.00	2026-10-24 17:40:31.382118+05:30
14	comp_mashtech	14	VCH-14-01	2026-10-19	Payment	Opening FY25 balance reconciliation for HDFC Bank - Current	950000.00	0.00	2026-10-24 17:40:31.382118+05:30
15	comp_mashtech	15	VCH-15-01	2026-10-19	Payment	Opening FY25 balance reconciliation for Hardware Inventory Stock	850000.00	0.00	2026-10-24 17:40:31.382118+05:30
16	comp_mashtech	16	VCH-16-01	2026-10-19	Receipt	Opening FY25 balance reconciliation for Enterprise SaaS Revenue	0.00	3100000.00	2026-10-24 17:40:31.382118+05:30
17	comp_mashtech	17	VCH-17-01	2026-10-19	Payment	Opening FY25 balance reconciliation for Cloud Infrastructure Expenses	420000.00	0.00	2026-10-24 17:40:31.382118+05:30
\.


--
-- TOC entry 5481 (class 0 OID 26248)
-- Dependencies: 258
-- Data for Name: branch_shrink_benchmarks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.branch_shrink_benchmarks (id, company_id, branch_code, branch_name, monthly_turnover, variance_value, shrink_rate_percent, peer_benchmark, grade, updated_at) FROM stdin;
1	comp_mann	AMD-01	Ahmedabad Central Hub & Warehouse (AMD-01)	1850000.00	4200.00	0.22	< 0.80% Target	Grade A+ (Exemplary)	2026-10-24 17:40:31.382118+05:30
2	comp_mann	SUR-02	Surat Franchise Depot (SUR-02)	980000.00	6850.00	0.69	< 0.80% Target	Grade B (Acceptable)	2026-10-24 17:40:31.382118+05:30
3	comp_mann	BRD-02	Baroda City Outlet & Service (BRD-02)	620000.00	3200.00	0.51	< 0.80% Target	Grade A (Low Shrinkage)	2026-10-24 17:40:31.382118+05:30
4	comp_mashtech	AND-01	And-Branch (Anand)	1850000.00	3200.00	0.17	0.45	GRADE A	2026-10-25 10:32:01.713396+05:30
5	comp_mashtech	SRU-02	Sru-Branch (Surat)	1850000.00	3200.00	0.17	0.45	GRADE A	2026-10-25 10:32:01.721096+05:30
6	comp_apexglobal_a1sf	ASH-01	Apex Surat Hub	1850000.00	3200.00	0.17	0.45	GRADE A	2026-10-25 10:32:01.736782+05:30
7	comp_zenithindu_vk4c	HCD-01	Halol Central Depot	1850000.00	3200.00	0.17	0.45	GRADE A	2026-10-25 10:33:03.016912+05:30
8	comp_acmetechno_cajc	MUM-01	Central Warehouse	1850000.00	3200.00	0.17	0.45	GRADE A	2026-10-25 10:33:03.041511+05:30
9	comp_mannengine_s000	MECB	Halol-MEC	1850000.00	3200.00	0.17	0.45	GRADE A	2026-10-25 10:33:03.064493+05:30
\.


--
-- TOC entry 5467 (class 0 OID 26043)
-- Dependencies: 244
-- Data for Name: branch_stock; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.branch_stock (id, company_id, branch_code, pid, current_stock, min_stock, status, created_at, updated_at) FROM stdin;
2	comp_mann	BRD-02	FE-ABC-4	12.00	20.00	Low	2026-10-24 11:16:47.740848+05:30	2026-10-24 11:16:47.740848+05:30
6	comp_mann	BRD-02	FE-CO2-2	6.00	15.00	Low	2026-10-24 11:16:47.740848+05:30	2026-10-24 11:16:47.740848+05:30
10	comp_mann	BRD-02	SH-M201	45.00	25.00	OK	2026-10-24 11:16:47.740848+05:30	2026-10-24 11:16:47.740848+05:30
14	comp_mann	BRD-02	SG-CL01	22.00	30.00	Low	2026-10-24 11:16:47.740848+05:30	2026-10-24 11:16:47.740848+05:30
17	comp_mann	AMD-01	FA-KIT1	24.00	10.00	OK	2026-10-24 11:16:47.740848+05:30	2026-10-24 11:16:47.740848+05:30
18	comp_mann	BRD-02	FA-KIT1	8.00	10.00	Low	2026-10-24 11:16:47.740848+05:30	2026-10-24 11:16:47.740848+05:30
21	comp_mann	AMD-01	FR-SUT5	15.00	5.00	OK	2026-10-24 11:16:47.740848+05:30	2026-10-24 11:16:47.740848+05:30
22	comp_mann	BRD-02	FR-SUT5	3.00	5.00	Low	2026-10-24 11:16:47.740848+05:30	2026-10-24 11:16:47.740848+05:30
25	comp_mann	AMD-01	SM-DET1	0.00	10.00	Out	2026-10-24 11:16:47.740848+05:30	2026-10-24 11:16:47.740848+05:30
26	comp_mann	BRD-02	SM-DET1	28.00	10.00	OK	2026-10-24 11:16:47.740848+05:30	2026-10-24 11:16:47.740848+05:30
29	comp_mann	AMD-01	CF-EXT-50	5.00	5.00	Low	2026-10-24 11:16:47.740848+05:30	2026-10-24 11:16:47.740848+05:30
30	comp_mann	BRD-02	CF-EXT-50	15.00	5.00	OK	2026-10-24 11:16:47.740848+05:30	2026-10-24 11:16:47.740848+05:30
33	comp_mann	AMD-01	FB-HVY-2	14.00	15.00	Low	2026-10-24 11:16:47.740848+05:30	2026-10-24 11:16:47.740848+05:30
34	comp_mann	BRD-02	FB-HVY-2	22.00	15.00	OK	2026-10-24 11:16:47.740848+05:30	2026-10-24 11:16:47.740848+05:30
37	comp_mann	AMD-01	GM-FFP3	90.00	10.00	OK	2026-10-24 11:16:47.740848+05:30	2026-10-24 11:16:47.740848+05:30
38	comp_mann	BRD-02	GM-FFP3	15.00	10.00	OK	2026-10-24 11:16:47.740848+05:30	2026-10-24 11:16:47.740848+05:30
41	comp_mann	AMD-01	CS-BOOT-9	30.00	8.00	OK	2026-10-24 11:16:47.740848+05:30	2026-10-24 11:16:47.740848+05:30
42	comp_mann	BRD-02	CS-BOOT-9	0.00	8.00	Out	2026-10-24 11:16:47.740848+05:30	2026-10-24 11:16:47.740848+05:30
45	comp_mann	AMD-01	HAZ-TYP3	12.00	10.00	OK	2026-10-24 11:16:47.740848+05:30	2026-10-24 11:16:47.740848+05:30
46	comp_mann	BRD-02	HAZ-TYP3	7.00	10.00	Low	2026-10-24 11:16:47.740848+05:30	2026-10-24 11:16:47.740848+05:30
49	comp_mann	AMD-01	SP-HDR-68	85.00	30.00	OK	2026-10-24 11:16:47.740848+05:30	2026-10-24 11:16:47.740848+05:30
50	comp_mann	BRD-02	SP-HDR-68	14.00	30.00	Low	2026-10-24 11:16:47.740848+05:30	2026-10-24 11:16:47.740848+05:30
53	comp_mann	AMD-01	HR-SWV-30	6.00	12.00	Low	2026-10-24 11:16:47.740848+05:30	2026-10-24 11:16:47.740848+05:30
54	comp_mann	BRD-02	HR-SWV-30	20.00	12.00	OK	2026-10-24 11:16:47.740848+05:30	2026-10-24 11:16:47.740848+05:30
57	comp_mann	AMD-01	HT-GLV-500	50.00	10.00	OK	2026-10-24 11:16:47.740848+05:30	2026-10-24 11:16:47.740848+05:30
58	comp_mann	BRD-02	HT-GLV-500	4.00	10.00	Low	2026-10-24 11:16:47.740848+05:30	2026-10-24 11:16:47.740848+05:30
61	comp_mann	AMD-01	EX-LED-BAT	20.00	15.00	OK	2026-10-24 11:16:47.740848+05:30	2026-10-24 11:16:47.740848+05:30
62	comp_mann	BRD-02	EX-LED-BAT	35.00	15.00	OK	2026-10-24 11:16:47.740848+05:30	2026-10-24 11:16:47.740848+05:30
65	comp_mashtech	AND-01	SRV-RCK-42	14.00	5.00	OK	2026-10-24 11:16:47.740848+05:30	2026-10-24 11:16:47.740848+05:30
66	comp_mashtech	SRU-02	SRV-RCK-42	0.00	5.00	Out	2026-10-24 11:16:47.740848+05:30	2026-10-24 11:16:47.740848+05:30
67	comp_mashtech	AND-01	UPS-3KVA-ON	5.00	8.00	Low	2026-10-24 11:16:47.740848+05:30	2026-10-24 11:16:47.740848+05:30
68	comp_mashtech	SRU-02	UPS-3KVA-ON	18.00	8.00	OK	2026-10-24 11:16:47.740848+05:30	2026-10-24 11:16:47.740848+05:30
69	comp_mashtech	AND-01	ESD-MAT-01	8.00	15.00	Low	2026-10-24 11:16:47.740848+05:30	2026-10-24 11:16:47.740848+05:30
70	comp_mashtech	SRU-02	ESD-MAT-01	30.00	15.00	OK	2026-10-24 11:16:47.740848+05:30	2026-10-24 11:16:47.740848+05:30
71	comp_mashtech	AND-01	CAT6A-100M	45.00	10.00	OK	2026-10-24 11:16:47.740848+05:30	2026-10-24 11:16:47.740848+05:30
72	comp_mashtech	SRU-02	CAT6A-100M	12.00	10.00	OK	2026-10-24 11:16:47.740848+05:30	2026-10-24 11:16:47.740848+05:30
73	comp_mashtech	AND-01	FW-GW-10G	0.00	4.00	Out	2026-10-24 11:16:47.740848+05:30	2026-10-24 11:16:47.740848+05:30
74	comp_mashtech	SRU-02	FW-GW-10G	15.00	4.00	OK	2026-10-24 11:16:47.740848+05:30	2026-10-24 11:16:47.740848+05:30
75	comp_mashtech	AND-01	FBR-SFP-10	22.00	20.00	OK	2026-10-24 11:16:47.740848+05:30	2026-10-24 11:16:47.740848+05:30
76	comp_mashtech	SRU-02	FBR-SFP-10	6.00	20.00	Low	2026-10-24 11:16:47.740848+05:30	2026-10-24 11:16:47.740848+05:30
77	comp_mashtech	AND-01	LSR-SFT-GLS	35.00	8.00	OK	2026-10-24 11:16:47.740848+05:30	2026-10-24 11:16:47.740848+05:30
78	comp_mashtech	SRU-02	LSR-SFT-GLS	40.00	8.00	OK	2026-10-24 11:16:47.740848+05:30	2026-10-24 11:16:47.740848+05:30
79	comp_mashtech	AND-01	RACK-PDU-16	12.00	5.00	OK	2026-10-24 11:16:47.740848+05:30	2026-10-24 11:16:47.740848+05:30
80	comp_mashtech	SRU-02	RACK-PDU-16	4.00	5.00	Low	2026-10-24 11:16:47.740848+05:30	2026-10-24 11:16:47.740848+05:30
13	comp_mann	AMD-01	SG-CL01	64.00	30.00	OK	2026-10-24 11:16:47.740848+05:30	2026-10-24 22:55:05.151355+05:30
9	comp_mann	AMD-01	SH-M201	8.00	25.00	Low	2026-10-24 11:16:47.740848+05:30	2026-10-25 01:15:10.911254+05:30
81	comp_mann	HAL-01	HT-GLV-500	36.00	10.00	OK	2026-10-25 02:06:48.076948+05:30	2026-10-25 02:06:48.076948+05:30
82	comp_mann	HAL-01	EX-LED-BAT	19.00	15.00	OK	2026-10-25 02:06:48.076948+05:30	2026-10-25 02:06:48.076948+05:30
83	comp_mann	HAL-01	SG-CL01	23.00	30.00	OK	2026-10-25 02:06:48.076948+05:30	2026-10-25 02:06:48.076948+05:30
84	comp_mann	HAL-01	FA-KIT1	22.00	10.00	OK	2026-10-25 02:06:48.076948+05:30	2026-10-25 02:06:48.076948+05:30
85	comp_mann	HAL-01	FR-SUT5	38.00	5.00	OK	2026-10-25 02:06:48.076948+05:30	2026-10-25 02:06:48.076948+05:30
86	comp_mann	HAL-01	FE-ABC-4	34.00	20.00	OK	2026-10-25 02:06:48.076948+05:30	2026-10-25 02:06:48.076948+05:30
87	comp_mann	HAL-01	CF-EXT-50	34.00	5.00	OK	2026-10-25 02:06:48.076948+05:30	2026-10-25 02:06:48.076948+05:30
5	comp_mann	AMD-01	FE-CO2-2	42.00	15.00	OK	2026-10-24 11:16:47.740848+05:30	2026-10-28 12:54:17.508158+05:30
1	comp_mann	AMD-01	FE-ABC-4	46.00	20.00	OK	2026-10-24 11:16:47.740848+05:30	2026-10-31 17:49:00.6789+05:30
88	comp_mann	HAL-01	FB-HVY-2	17.00	15.00	OK	2026-10-25 02:06:48.076948+05:30	2026-10-25 02:06:48.076948+05:30
89	comp_mann	HAL-01	GM-FFP3	23.00	10.00	OK	2026-10-25 02:06:48.076948+05:30	2026-10-25 02:06:48.076948+05:30
90	comp_mann	HAL-01	CS-BOOT-9	32.00	8.00	OK	2026-10-25 02:06:48.076948+05:30	2026-10-25 02:06:48.076948+05:30
91	comp_mann	HAL-01	HAZ-TYP3	23.00	10.00	OK	2026-10-25 02:06:48.076948+05:30	2026-10-25 02:06:48.076948+05:30
92	comp_mann	HAL-01	SM-DET1	28.00	10.00	OK	2026-10-25 02:06:48.076948+05:30	2026-10-25 02:06:48.076948+05:30
94	comp_mann	HAL-01	SP-HDR-68	38.00	30.00	OK	2026-10-25 02:06:48.076948+05:30	2026-10-25 02:06:48.076948+05:30
95	comp_mann	HAL-01	HR-SWV-30	25.00	12.00	OK	2026-10-25 02:06:48.076948+05:30	2026-10-25 02:06:48.076948+05:30
96	comp_mann	HAL-01	SH-M201	30.00	25.00	OK	2026-10-25 02:06:48.076948+05:30	2026-10-25 02:06:48.076948+05:30
97	comp_apexglobal_a1sf	ASH-01	PRD-START-01	45.00	10.00	OK	2026-10-25 08:57:03.809317+05:30	2026-10-25 08:57:03.809317+05:30
98	comp_apexglobal_a1sf	ASH-01	PRD-START-02	25.00	10.00	OK	2026-10-25 08:57:03.809317+05:30	2026-10-25 08:57:03.809317+05:30
99	comp_apexglobal_a1sf	ASH-01	PRD-START-03	80.00	10.00	OK	2026-10-25 08:57:03.809317+05:30	2026-10-25 08:57:03.809317+05:30
100	comp_zenithindu_vk4c	HCD-01	PRD-START-01	45.00	10.00	OK	2026-10-25 09:02:14.545842+05:30	2026-10-25 09:02:14.545842+05:30
101	comp_zenithindu_vk4c	HCD-01	PRD-START-02	25.00	10.00	OK	2026-10-25 09:02:14.545842+05:30	2026-10-25 09:02:14.545842+05:30
102	comp_zenithindu_vk4c	HCD-01	PRD-START-03	80.00	10.00	OK	2026-10-25 09:02:14.545842+05:30	2026-10-25 09:02:14.545842+05:30
103	comp_acmetechno_cajc	MUM-01	PRD-START-01	45.00	10.00	OK	2026-10-25 09:05:50.198483+05:30	2026-10-25 09:05:50.198483+05:30
104	comp_acmetechno_cajc	MUM-01	PRD-START-02	25.00	10.00	OK	2026-10-25 09:05:50.198483+05:30	2026-10-25 09:05:50.198483+05:30
105	comp_acmetechno_cajc	MUM-01	PRD-START-03	80.00	10.00	OK	2026-10-25 09:05:50.198483+05:30	2026-10-25 09:05:50.198483+05:30
107	comp_mannengine_s000	MECB	PRD-START-02	25.00	10.00	OK	2026-10-25 09:25:03.672677+05:30	2026-10-25 09:25:03.672677+05:30
108	comp_mannengine_s000	MECB	PRD-START-03	80.00	10.00	OK	2026-10-25 09:25:03.672677+05:30	2026-10-25 09:25:03.672677+05:30
106	comp_mannengine_s000	MECB	PRD-START-01	44.00	10.00	OK	2026-10-25 09:25:03.672677+05:30	2026-10-28 11:53:19.092699+05:30
93	comp_mann	HAL-01	FE-CO2-2	27.00	15.00	OK	2026-10-25 02:06:48.076948+05:30	2026-10-28 12:54:17.495471+05:30
110	comp_mann	AMD-01	TEST-COMMON-1793386841859	25.00	5.00	OK	2026-10-31 00:30:41.961205+05:30	2026-10-31 00:30:41.961205+05:30
\.


--
-- TOC entry 5461 (class 0 OID 25909)
-- Dependencies: 238
-- Data for Name: branches; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.branches (id, company_id, code, name, city, state, type, latitude, longitude, status, created_at, updated_at, address, phone, email, gstin) FROM stdin;
3	comp_mashtech	AND-01	And-Branch (Anand)	Anand	Gujarat	TECH_CENTRE	22.564500	72.928900	Active	2026-10-24 02:01:12.285918+05:30	2026-10-24 02:01:12.285918+05:30				
4	comp_mashtech	SRU-02	Sru-Branch (Surat)	Surat	Gujarat	BRANCH_DEPOT	21.170200	72.831100	Active	2026-10-24 02:01:12.285918+05:30	2026-10-24 02:01:12.285918+05:30				
55	comp_mannengine_s000	MECB	Halol-MEC	Halol	Gujarat	FLAGSHIP_STORE	22.502500	73.471400	Active	2026-10-25 09:25:03.672677+05:30	2026-10-25 10:10:57.75994+05:30	Mann Engineers, GIDC Industrial Estate, Halol	8799061100	shahmann85@gmail.com	24AAKHM5573J1ZT
16	comp_mann	HAL-01	Halol	Halol	Gujarat	WAREHOUSE_DEPOT	22.557658	72.922414	Active	2026-10-24 10:35:10.123365+05:30	2026-10-24 10:35:10.123365+05:30				
48	comp_apexglobal_a1sf	ASH-01	Apex Surat Hub	Gujarat	Gujarat	FLAGSHIP_STORE	23.022500	72.571400	Active	2026-10-25 08:57:03.809317+05:30	2026-10-25 08:57:03.809317+05:30	101 Cyber City	9998887776	owner_1792898823721@apexcorp.com	24AABCA1234D1ZP
51	comp_zenithindu_vk4c	HCD-01	Halol Central Depot	Gujarat	Gujarat	FLAGSHIP_STORE	23.022500	72.571400	Active	2026-10-25 09:02:14.545842+05:30	2026-10-25 09:02:14.545842+05:30	Plot 20, GIDC	9727100200	owner_1792899134424@zenithenterprise.in	24AAACZ1122K1Z9
52	comp_acmetechno_cajc	MUM-01	Central Warehouse	Maharashtra	Maharashtra	FLAGSHIP_STORE	23.022500	72.571400	Active	2026-10-25 09:05:50.198483+05:30	2026-10-25 09:05:50.198483+05:30	Plot 12, MIDC Industrial Area	9876543210	owner_pilot@enterprise.in	27AABCU9603R1ZM
1	comp_mann	AMD-01	Amd-Branch (Ahmedabad)	Ahmedabad	Gujarat	FLAGSHIP_STORE	23.022500	72.571400	Active	2026-10-24 02:01:12.285918+05:30	2026-11-15 17:39:43.909408+05:30	Shop 12-14, Ground Floor, Shivalik Plaza, IIM Road, Panjrapole, Ahmedabad	+91 79 2630 1100	ahmedabad@mannengineers.in	24AAACM1234F1Z8
2	comp_mann	BRD-02	Brd-Branch (Baroda)	Vadodara	Gujarat	REGIONAL_HUB	22.307159	73.181219	Active	2026-10-24 02:01:12.285918+05:30	2026-11-15 17:39:43.909408+05:30	Plot 45, GIDC Industrial Estate, Makarpura, Vadodara	+91 265 2640 2200	baroda@mannengineers.in	24AAACM1234F2Z7
\.


--
-- TOC entry 5459 (class 0 OID 25869)
-- Dependencies: 236
-- Data for Name: cash_book; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cash_book (id, company_id, branch_code, entry_no, entry_date, type, party, category, ref_no, narration, dr_amount, cr_amount, balance, payment_mode, reconciled, created_by, created_at, updated_at) FROM stdin;
1	comp_mann	AMD-01	1	2026-10-19	Receipt	Gujarat Fire Services	Counter Sales	REC-0410	Cash sale Invoice #3	8500.00	0.00	53700.00	Cash	t	Admin	2026-10-23 18:43:29.351356+05:30	2026-10-23 18:43:29.351356+05:30
2	comp_mann	AMD-01	2	2026-10-20	Payment	Courier Service	Office Expenses	PAY-0230	Delivery charges for urgent dispatch	0.00	750.00	52950.00	Cash	t	Admin	2026-10-23 18:43:29.35377+05:30	2026-10-23 18:43:29.35377+05:30
3	comp_mann	AMD-01	3	2026-10-21	Receipt	ABC Safety Pvt Ltd	Customer Payment	REC-0411	Part payment against Invoice #1	15000.00	0.00	67950.00	Cash	t	Admin	2026-10-23 18:43:29.355043+05:30	2026-10-23 18:43:29.355043+05:30
4	comp_mann	AMD-01	4	2026-10-22	Contra	HDFC Bank A/c	Bank Deposit	CTR-0089	Excess cash deposited to bank account	0.00	25000.00	42950.00	Bank Transfer	t	Admin	2026-10-23 18:43:29.356263+05:30	2026-10-23 18:43:29.356263+05:30
5	comp_mann	AMD-01	5	2026-10-23	Payment	Stationery Mart	Supplies	PAY-0231	Office stationery and bill books	0.00	1200.00	41750.00	Cash	t	Admin	2026-10-23 18:43:29.357626+05:30	2026-10-23 18:43:29.357626+05:30
6	comp_mann	AMD-01	6	2026-10-23	Receipt	Walk-in Customer	Counter Sales	REC-0412	Counter sale Invoice #5	12450.00	0.00	54200.00	Cash	t	Admin	2026-10-23 18:43:29.358983+05:30	2026-10-23 18:43:29.358983+05:30
7	comp_mashtech	AND-01	1	2026-10-23	Receipt	Reliance Jamnagar	Counter Sales	REC-997	Parts payment	5000.00	0.00	5000.00	Cash	t	And-Branch Manager	2026-10-23 18:58:13.313783+05:30	2026-10-23 18:58:26.914097+05:30
8	comp_mann	BRD-02	CB-1001	2026-05-02	Receipt	Adani Ports & Special Economic Zone	Counter Sales	INV-2026-1001	Payment received against invoice INV-2026-1001	19600.98	0.00	19600.98	Bank Transfer	t	Admin	2026-10-24 09:37:39.681441+05:30	2026-10-24 09:37:39.681441+05:30
9	comp_mann	AMD-01	CB-1002	2026-05-03	Receipt	Torrent Pharmaceuticals Ltd	Counter Sales	INV-2026-1002	Payment received against invoice INV-2026-1002	277011.82	0.00	277011.82	UPI	t	Admin	2026-10-24 09:37:39.690826+05:30	2026-10-24 09:37:39.690826+05:30
10	comp_mann	AMD-01	CB-1003	2026-05-03	Payment	Logistics & Operations Vendor	Warehouse Freight	EXP-1003	Expense disbursed for Warehouse Freight	0.00	5434.00	5434.00	Bank Transfer	t	Admin	2026-10-24 09:37:39.692001+05:30	2026-10-24 09:37:39.692001+05:30
11	comp_mann	BRD-02	CB-1004	2026-05-04	Receipt	Gujarat State Fertilizers & Chemicals	Counter Sales	INV-2026-1003	Payment received against invoice INV-2026-1003	7240.48	0.00	7240.48	UPI	t	Admin	2026-10-24 09:37:39.694782+05:30	2026-10-24 09:37:39.694782+05:30
12	comp_mann	AMD-01	CB-1005	2026-05-04	Receipt	Adani Ports & Special Economic Zone	Counter Sales	INV-2026-1004	Payment received against invoice INV-2026-1004	57914.76	0.00	57914.76	UPI	t	Admin	2026-10-24 09:37:39.699535+05:30	2026-10-24 09:37:39.699535+05:30
13	comp_mann	BRD-02	CB-1006	2026-05-04	Receipt	L&T Knowledge City Complex	Counter Sales	INV-2026-1005	Payment received against invoice INV-2026-1005	438440.00	0.00	438440.00	Bank Transfer	t	Admin	2026-10-24 09:37:39.701938+05:30	2026-10-24 09:37:39.701938+05:30
14	comp_mann	BRD-02	CB-1007	2026-05-04	Payment	Logistics & Operations Vendor	Warehouse Freight	EXP-1007	Expense disbursed for Warehouse Freight	0.00	8948.00	8948.00	Bank Transfer	t	Admin	2026-10-24 09:37:39.7026+05:30	2026-10-24 09:37:39.7026+05:30
15	comp_mann	AMD-01	CB-1008	2026-05-05	Receipt	Zydus Lifesciences Biotech Park	Counter Sales	INV-2026-1006	Payment received against invoice INV-2026-1006	474321.79	0.00	474321.79	Bank Transfer	t	Admin	2026-10-24 09:37:39.710575+05:30	2026-10-24 09:37:39.710575+05:30
16	comp_mann	AMD-01	CB-1009	2026-05-05	Receipt	Amul Dairy Technical Facilities	Counter Sales	INV-2026-1007	Payment received against invoice INV-2026-1007	7658.20	0.00	7658.20	UPI	t	Admin	2026-10-24 09:37:39.712962+05:30	2026-10-24 09:37:39.712962+05:30
17	comp_mashtech	SRU-02	CB-1010	2026-05-06	Receipt	L&T Knowledge City Complex	Counter Sales	INV-2026-1008	Payment received against invoice INV-2026-1008	38664.08	0.00	38664.08	UPI	t	Admin	2026-10-24 09:37:39.716772+05:30	2026-10-24 09:37:39.716772+05:30
18	comp_mashtech	SRU-02	CB-1011	2026-05-06	Payment	Logistics & Operations Vendor	Equipment Packaging	EXP-1011	Expense disbursed for Equipment Packaging	0.00	4481.00	4481.00	Bank Transfer	t	Admin	2026-10-24 09:37:39.717465+05:30	2026-10-24 09:37:39.717465+05:30
19	comp_mashtech	SRU-02	CB-1012	2026-05-07	Receipt	Zydus Lifesciences Biotech Park	Counter Sales	INV-2026-1009	Payment received against invoice INV-2026-1009	4873.40	0.00	4873.40	Bank Transfer	t	Admin	2026-10-24 09:37:39.720293+05:30	2026-10-24 09:37:39.720293+05:30
20	comp_mashtech	SRU-02	CB-1013	2026-05-08	Receipt	Tata Motors Manufacturing Plant	Counter Sales	INV-2026-1010	Payment received against invoice INV-2026-1010	26164.13	0.00	26164.13	Bank Transfer	t	Admin	2026-10-24 09:37:39.724128+05:30	2026-10-24 09:37:39.724128+05:30
21	comp_mashtech	SRU-02	CB-1014	2026-05-10	Receipt	Alembic Pharmaceuticals Limited	Counter Sales	INV-2026-1011	Payment received against invoice INV-2026-1011	58032.28	0.00	58032.28	Bank Transfer	t	Admin	2026-10-24 09:37:39.728002+05:30	2026-10-24 09:37:39.728002+05:30
22	comp_mashtech	SRU-02	CB-1015	2026-05-10	Payment	Logistics & Operations Vendor	Utility & Electricity	EXP-1015	Expense disbursed for Utility & Electricity	0.00	6692.00	6692.00	Bank Transfer	t	Admin	2026-10-24 09:37:39.728715+05:30	2026-10-24 09:37:39.728715+05:30
23	comp_mashtech	AND-01	CB-1016	2026-05-11	Receipt	Tata Motors Manufacturing Plant	Counter Sales	INV-2026-1012	Payment received against invoice INV-2026-1012	760603.00	0.00	760603.00	UPI	t	Admin	2026-10-24 09:37:39.731434+05:30	2026-10-24 09:37:39.731434+05:30
24	comp_mashtech	AND-01	CB-1017	2026-05-12	Receipt	Adani Ports & Special Economic Zone	Counter Sales	INV-2026-1013	Payment received against invoice INV-2026-1013	26899.65	0.00	26899.65	Cash	t	Admin	2026-10-24 09:37:39.734582+05:30	2026-10-24 09:37:39.734582+05:30
25	comp_mann	AMD-01	CB-1018	2026-05-12	Receipt	Torrent Pharmaceuticals Ltd	Counter Sales	INV-2026-1014	Payment received against invoice INV-2026-1014	324155.19	0.00	324155.19	Bank Transfer	t	Admin	2026-10-24 09:37:39.73728+05:30	2026-10-24 09:37:39.73728+05:30
26	comp_mann	AMD-01	CB-1019	2026-05-12	Payment	Logistics & Operations Vendor	Equipment Packaging	EXP-1019	Expense disbursed for Equipment Packaging	0.00	4738.00	4738.00	Bank Transfer	t	Admin	2026-10-24 09:37:39.73789+05:30	2026-10-24 09:37:39.73789+05:30
27	comp_mann	AMD-01	CB-1020	2026-05-13	Receipt	L&T Knowledge City Complex	Counter Sales	INV-2026-1015	Payment received against invoice INV-2026-1015	64798.72	0.00	64798.72	UPI	t	Admin	2026-10-24 09:37:39.740458+05:30	2026-10-24 09:37:39.740458+05:30
28	comp_mann	AMD-01	CB-1021	2026-05-13	Receipt	Shreeji Industrial Safety Systems	Counter Sales	INV-2026-1016	Payment received against invoice INV-2026-1016	128851.64	0.00	128851.64	Card	t	Admin	2026-10-24 09:37:39.743845+05:30	2026-10-24 09:37:39.743845+05:30
29	comp_mann	AMD-01	CB-1022	2026-05-14	Receipt	Zydus Lifesciences Biotech Park	Counter Sales	INV-2026-1017	Payment received against invoice INV-2026-1017	1001939.36	0.00	1001939.36	Cash	t	Admin	2026-10-24 09:37:39.750595+05:30	2026-10-24 09:37:39.750595+05:30
30	comp_mann	AMD-01	CB-1023	2026-05-14	Payment	Logistics & Operations Vendor	Equipment Packaging	EXP-1023	Expense disbursed for Equipment Packaging	0.00	5589.00	5589.00	Bank Transfer	t	Admin	2026-10-24 09:37:39.75121+05:30	2026-10-24 09:37:39.75121+05:30
31	comp_mashtech	AND-01	CB-1024	2026-05-14	Receipt	Alembic Pharmaceuticals Limited	Counter Sales	INV-2026-1018	Payment received against invoice INV-2026-1018	6237.95	0.00	6237.95	Bank Transfer	t	Admin	2026-10-24 09:37:39.753956+05:30	2026-10-24 09:37:39.753956+05:30
32	comp_mashtech	AND-01	CB-1025	2026-05-15	Receipt	Torrent Pharmaceuticals Ltd	Counter Sales	INV-2026-1019	Payment received against invoice INV-2026-1019	3063.28	0.00	3063.28	Bank Transfer	t	Admin	2026-10-24 09:37:39.756593+05:30	2026-10-24 09:37:39.756593+05:30
33	comp_mann	BRD-02	CB-1026	2026-05-15	Receipt	Reliance Industries Ltd (Hazira Complex)	Counter Sales	INV-2026-1020	Payment received against invoice INV-2026-1020	22767.35	0.00	22767.35	Cash	t	Admin	2026-10-24 09:37:39.76035+05:30	2026-10-24 09:37:39.76035+05:30
34	comp_mann	BRD-02	CB-1027	2026-05-15	Payment	Logistics & Operations Vendor	Equipment Packaging	EXP-1027	Expense disbursed for Equipment Packaging	0.00	6829.00	6829.00	Bank Transfer	t	Admin	2026-10-24 09:37:39.761043+05:30	2026-10-24 09:37:39.761043+05:30
35	comp_mann	AMD-01	CB-1028	2026-05-18	Receipt	Adani Ports & Special Economic Zone	Counter Sales	INV-2026-1021	Payment received against invoice INV-2026-1021	57146.36	0.00	57146.36	Bank Transfer	t	Admin	2026-10-24 09:37:39.764619+05:30	2026-10-24 09:37:39.764619+05:30
36	comp_mann	BRD-02	CB-1029	2026-05-18	Receipt	Adani Ports & Special Economic Zone	Counter Sales	INV-2026-1022	Payment received against invoice INV-2026-1022	67037.25	0.00	67037.25	Bank Transfer	t	Admin	2026-10-24 09:37:39.768451+05:30	2026-10-24 09:37:39.768451+05:30
37	comp_mann	AMD-01	CB-1030	2026-05-18	Receipt	Shreeji Industrial Safety Systems	Counter Sales	INV-2026-1023	Payment received against invoice INV-2026-1023	29639.90	0.00	29639.90	Bank Transfer	t	Admin	2026-10-24 09:37:39.773515+05:30	2026-10-24 09:37:39.773515+05:30
38	comp_mann	AMD-01	CB-1031	2026-05-18	Payment	Logistics & Operations Vendor	Branch Maintenance	EXP-1031	Expense disbursed for Branch Maintenance	0.00	2374.00	2374.00	Bank Transfer	t	Admin	2026-10-24 09:37:39.774057+05:30	2026-10-24 09:37:39.774057+05:30
39	comp_mann	BRD-02	CB-1032	2026-05-19	Receipt	Zydus Lifesciences Biotech Park	Counter Sales	INV-2026-1024	Payment received against invoice INV-2026-1024	335384.00	0.00	335384.00	Card	t	Admin	2026-10-24 09:37:39.776617+05:30	2026-10-24 09:37:39.776617+05:30
40	comp_mann	AMD-01	CB-1033	2026-05-19	Receipt	Adani Ports & Special Economic Zone	Counter Sales	INV-2026-1025	Payment received against invoice INV-2026-1025	259339.52	0.00	259339.52	Bank Transfer	t	Admin	2026-10-24 09:37:39.780046+05:30	2026-10-24 09:37:39.780046+05:30
41	comp_mann	BRD-02	CB-1034	2026-05-19	Receipt	Zydus Lifesciences Biotech Park	Counter Sales	INV-2026-1026	Payment received against invoice INV-2026-1026	684219.52	0.00	684219.52	Card	t	Admin	2026-10-24 09:37:39.783808+05:30	2026-10-24 09:37:39.783808+05:30
42	comp_mann	BRD-02	CB-1035	2026-05-19	Payment	Logistics & Operations Vendor	Warehouse Freight	EXP-1035	Expense disbursed for Warehouse Freight	0.00	6873.00	6873.00	Bank Transfer	t	Admin	2026-10-24 09:37:39.784518+05:30	2026-10-24 09:37:39.784518+05:30
43	comp_mashtech	AND-01	CB-1036	2026-05-20	Receipt	L&T Knowledge City Complex	Counter Sales	INV-2026-1027	Payment received against invoice INV-2026-1027	439580.05	0.00	439580.05	UPI	t	Admin	2026-10-24 09:37:39.787559+05:30	2026-10-24 09:37:39.787559+05:30
44	comp_mashtech	SRU-02	CB-1037	2026-05-20	Receipt	Reliance Industries Ltd (Hazira Complex)	Counter Sales	INV-2026-1028	Payment received against invoice INV-2026-1028	489443.68	0.00	489443.68	UPI	t	Admin	2026-10-24 09:37:39.790949+05:30	2026-10-24 09:37:39.790949+05:30
45	comp_mann	AMD-01	CB-1038	2026-05-20	Receipt	Torrent Pharmaceuticals Ltd	Counter Sales	INV-2026-1029	Payment received against invoice INV-2026-1029	984939.64	0.00	984939.64	UPI	t	Admin	2026-10-24 09:37:39.794815+05:30	2026-10-24 09:37:39.794815+05:30
46	comp_mann	AMD-01	CB-1039	2026-05-20	Payment	Logistics & Operations Vendor	Warehouse Freight	EXP-1039	Expense disbursed for Warehouse Freight	0.00	4440.00	4440.00	Bank Transfer	t	Admin	2026-10-24 09:37:39.795386+05:30	2026-10-24 09:37:39.795386+05:30
47	comp_mann	AMD-01	CB-1040	2026-05-21	Receipt	L&T Knowledge City Complex	Counter Sales	INV-2026-1030	Payment received against invoice INV-2026-1030	114385.38	0.00	114385.38	Card	t	Admin	2026-10-24 09:37:39.797959+05:30	2026-10-24 09:37:39.797959+05:30
48	comp_mann	AMD-01	CB-1041	2026-05-22	Receipt	Tata Motors Manufacturing Plant	Counter Sales	INV-2026-1031	Payment received against invoice INV-2026-1031	18492.45	0.00	18492.45	Bank Transfer	t	Admin	2026-10-24 09:37:39.80178+05:30	2026-10-24 09:37:39.80178+05:30
49	comp_mann	AMD-01	CB-1042	2026-05-22	Receipt	Torrent Pharmaceuticals Ltd	Counter Sales	INV-2026-1032	Payment received against invoice INV-2026-1032	115987.72	0.00	115987.72	Cash	t	Admin	2026-10-24 09:37:39.805606+05:30	2026-10-24 09:37:39.805606+05:30
50	comp_mann	AMD-01	CB-1043	2026-05-22	Payment	Logistics & Operations Vendor	Warehouse Freight	EXP-1043	Expense disbursed for Warehouse Freight	0.00	7216.00	7216.00	Bank Transfer	t	Admin	2026-10-24 09:37:39.806208+05:30	2026-10-24 09:37:39.806208+05:30
51	comp_mann	BRD-02	CB-1044	2026-05-24	Receipt	Amul Dairy Technical Facilities	Counter Sales	INV-2026-1033	Payment received against invoice INV-2026-1033	196116.13	0.00	196116.13	UPI	t	Admin	2026-10-24 09:37:39.809746+05:30	2026-10-24 09:37:39.809746+05:30
52	comp_mann	AMD-01	CB-1045	2026-05-25	Receipt	Tata Motors Manufacturing Plant	Counter Sales	INV-2026-1034	Payment received against invoice INV-2026-1034	495145.09	0.00	495145.09	UPI	t	Admin	2026-10-24 09:37:39.812505+05:30	2026-10-24 09:37:39.812505+05:30
53	comp_mann	BRD-02	CB-1046	2026-05-26	Receipt	Adani Ports & Special Economic Zone	Counter Sales	INV-2026-1035	Payment received against invoice INV-2026-1035	84483.32	0.00	84483.32	Bank Transfer	t	Admin	2026-10-24 09:37:39.815358+05:30	2026-10-24 09:37:39.815358+05:30
54	comp_mann	BRD-02	CB-1047	2026-05-26	Payment	Logistics & Operations Vendor	Utility & Electricity	EXP-1047	Expense disbursed for Utility & Electricity	0.00	3400.00	3400.00	Bank Transfer	t	Admin	2026-10-24 09:37:39.816003+05:30	2026-10-24 09:37:39.816003+05:30
55	comp_mann	AMD-01	CB-1048	2026-05-26	Receipt	Reliance Industries Ltd (Hazira Complex)	Counter Sales	INV-2026-1036	Payment received against invoice INV-2026-1036	4361.28	0.00	4361.28	Bank Transfer	t	Admin	2026-10-24 09:37:39.819032+05:30	2026-10-24 09:37:39.819032+05:30
56	comp_mann	AMD-01	CB-1049	2026-05-26	Receipt	Alembic Pharmaceuticals Limited	Counter Sales	INV-2026-1037	Payment received against invoice INV-2026-1037	191629.92	0.00	191629.92	Cash	t	Admin	2026-10-24 09:37:39.82223+05:30	2026-10-24 09:37:39.82223+05:30
57	comp_mann	AMD-01	CB-1050	2026-05-27	Receipt	Adani Ports & Special Economic Zone	Counter Sales	INV-2026-1038	Payment received against invoice INV-2026-1038	51069.22	0.00	51069.22	Bank Transfer	t	Admin	2026-10-24 09:37:39.824855+05:30	2026-10-24 09:37:39.824855+05:30
58	comp_mann	AMD-01	CB-1051	2026-05-27	Payment	Logistics & Operations Vendor	Safety Inspection Fee	EXP-1051	Expense disbursed for Safety Inspection Fee	0.00	4289.00	4289.00	Bank Transfer	t	Admin	2026-10-24 09:37:39.825412+05:30	2026-10-24 09:37:39.825412+05:30
59	comp_mann	BRD-02	CB-1052	2026-05-27	Receipt	Tata Motors Manufacturing Plant	Counter Sales	INV-2026-1039	Payment received against invoice INV-2026-1039	91367.28	0.00	91367.28	UPI	t	Admin	2026-10-24 09:37:39.828463+05:30	2026-10-24 09:37:39.828463+05:30
60	comp_mashtech	AND-01	CB-1053	2026-05-27	Receipt	Gujarat State Fertilizers & Chemicals	Counter Sales	INV-2026-1040	Payment received against invoice INV-2026-1040	618395.89	0.00	618395.89	Bank Transfer	t	Admin	2026-10-24 09:37:39.831516+05:30	2026-10-24 09:37:39.831516+05:30
61	comp_mann	BRD-02	CB-1054	2026-05-28	Receipt	Torrent Pharmaceuticals Ltd	Counter Sales	INV-2026-1041	Payment received against invoice INV-2026-1041	6822.76	0.00	6822.76	UPI	t	Admin	2026-10-24 09:37:39.834107+05:30	2026-10-24 09:37:39.834107+05:30
62	comp_mann	BRD-02	CB-1055	2026-05-28	Payment	Logistics & Operations Vendor	Utility & Electricity	EXP-1055	Expense disbursed for Utility & Electricity	0.00	9616.00	9616.00	Bank Transfer	t	Admin	2026-10-24 09:37:39.834872+05:30	2026-10-24 09:37:39.834872+05:30
63	comp_mann	BRD-02	CB-1056	2026-05-28	Receipt	Gujarat State Fertilizers & Chemicals	Counter Sales	INV-2026-1042	Payment received against invoice INV-2026-1042	28599.17	0.00	28599.17	Bank Transfer	t	Admin	2026-10-24 09:37:39.838941+05:30	2026-10-24 09:37:39.838941+05:30
64	comp_mashtech	AND-01	CB-1057	2026-05-29	Receipt	Gujarat State Fertilizers & Chemicals	Counter Sales	INV-2026-1043	Payment received against invoice INV-2026-1043	22467.79	0.00	22467.79	Card	t	Admin	2026-10-24 09:37:39.842231+05:30	2026-10-24 09:37:39.842231+05:30
65	comp_mashtech	AND-01	CB-1058	2026-05-31	Receipt	Torrent Pharmaceuticals Ltd	Counter Sales	INV-2026-1044	Payment received against invoice INV-2026-1044	34427.71	0.00	34427.71	Cash	t	Admin	2026-10-24 09:37:39.84557+05:30	2026-10-24 09:37:39.84557+05:30
66	comp_mashtech	AND-01	CB-1059	2026-05-31	Payment	Logistics & Operations Vendor	Safety Inspection Fee	EXP-1059	Expense disbursed for Safety Inspection Fee	0.00	2639.00	2639.00	Bank Transfer	t	Admin	2026-10-24 09:37:39.846396+05:30	2026-10-24 09:37:39.846396+05:30
67	comp_mann	AMD-01	CB-1060	2026-06-01	Receipt	Shreeji Industrial Safety Systems	Counter Sales	INV-2026-1045	Payment received against invoice INV-2026-1045	42420.20	0.00	42420.20	UPI	t	Admin	2026-10-24 09:37:39.850138+05:30	2026-10-24 09:37:39.850138+05:30
68	comp_mashtech	AND-01	CB-1061	2026-06-02	Receipt	Reliance Industries Ltd (Hazira Complex)	Counter Sales	INV-2026-1046	Payment received against invoice INV-2026-1046	110018.61	0.00	110018.61	UPI	t	Admin	2026-10-24 09:37:39.855496+05:30	2026-10-24 09:37:39.855496+05:30
69	comp_mann	AMD-01	CB-1062	2026-06-02	Receipt	Amul Dairy Technical Facilities	Counter Sales	INV-2026-1047	Payment received against invoice INV-2026-1047	2180.64	0.00	2180.64	Cash	t	Admin	2026-10-24 09:37:39.858458+05:30	2026-10-24 09:37:39.858458+05:30
70	comp_mann	AMD-01	CB-1063	2026-06-02	Payment	Logistics & Operations Vendor	Safety Inspection Fee	EXP-1063	Expense disbursed for Safety Inspection Fee	0.00	5362.00	5362.00	Bank Transfer	t	Admin	2026-10-24 09:37:39.859386+05:30	2026-10-24 09:37:39.859386+05:30
71	comp_mann	AMD-01	CB-1064	2026-06-02	Receipt	L&T Knowledge City Complex	Counter Sales	INV-2026-1048	Payment received against invoice INV-2026-1048	1009.49	0.00	1009.49	Bank Transfer	t	Admin	2026-10-24 09:37:39.862315+05:30	2026-10-24 09:37:39.862315+05:30
72	comp_mann	AMD-01	CB-1065	2026-06-03	Receipt	Amul Dairy Technical Facilities	Counter Sales	INV-2026-1049	Payment received against invoice INV-2026-1049	428414.64	0.00	428414.64	Bank Transfer	t	Admin	2026-10-24 09:37:39.868863+05:30	2026-10-24 09:37:39.868863+05:30
73	comp_mashtech	AND-01	CB-1066	2026-06-03	Receipt	Reliance Industries Ltd (Hazira Complex)	Counter Sales	INV-2026-1050	Payment received against invoice INV-2026-1050	10684.90	0.00	10684.90	Cash	t	Admin	2026-10-24 09:37:39.87262+05:30	2026-10-24 09:37:39.87262+05:30
74	comp_mashtech	AND-01	CB-1067	2026-06-03	Payment	Logistics & Operations Vendor	Safety Inspection Fee	EXP-1067	Expense disbursed for Safety Inspection Fee	0.00	9357.00	9357.00	Bank Transfer	t	Admin	2026-10-24 09:37:39.873465+05:30	2026-10-24 09:37:39.873465+05:30
75	comp_mashtech	SRU-02	CB-1068	2026-06-03	Receipt	Tata Motors Manufacturing Plant	Counter Sales	INV-2026-1051	Payment received against invoice INV-2026-1051	793.67	0.00	793.67	Card	t	Admin	2026-10-24 09:37:39.877263+05:30	2026-10-24 09:37:39.877263+05:30
76	comp_mann	AMD-01	CB-1069	2026-06-04	Receipt	Reliance Industries Ltd (Hazira Complex)	Counter Sales	INV-2026-1052	Payment received against invoice INV-2026-1052	15436.76	0.00	15436.76	Cash	t	Admin	2026-10-24 09:37:39.880858+05:30	2026-10-24 09:37:39.880858+05:30
77	comp_mashtech	SRU-02	CB-1070	2026-06-04	Receipt	Shreeji Industrial Safety Systems	Counter Sales	INV-2026-1053	Payment received against invoice INV-2026-1053	3481.00	0.00	3481.00	UPI	t	Admin	2026-10-24 09:37:39.882523+05:30	2026-10-24 09:37:39.882523+05:30
78	comp_mashtech	SRU-02	CB-1071	2026-06-04	Payment	Logistics & Operations Vendor	Branch Maintenance	EXP-1071	Expense disbursed for Branch Maintenance	0.00	5100.00	5100.00	Bank Transfer	t	Admin	2026-10-24 09:37:39.883372+05:30	2026-10-24 09:37:39.883372+05:30
79	comp_mann	BRD-02	CB-1072	2026-06-04	Receipt	Gujarat State Fertilizers & Chemicals	Counter Sales	INV-2026-1054	Payment received against invoice INV-2026-1054	936950.80	0.00	936950.80	UPI	t	Admin	2026-10-24 09:37:39.888283+05:30	2026-10-24 09:37:39.888283+05:30
80	comp_mann	BRD-02	CB-1073	2026-06-05	Receipt	Tata Motors Manufacturing Plant	Counter Sales	INV-2026-1055	Payment received against invoice INV-2026-1055	420360.00	0.00	420360.00	UPI	t	Admin	2026-10-24 09:37:39.890638+05:30	2026-10-24 09:37:39.890638+05:30
81	comp_mann	BRD-02	CB-1074	2026-06-05	Receipt	L&T Knowledge City Complex	Counter Sales	INV-2026-1056	Payment received against invoice INV-2026-1056	4493.44	0.00	4493.44	Card	t	Admin	2026-10-24 09:37:39.892482+05:30	2026-10-24 09:37:39.892482+05:30
82	comp_mann	BRD-02	CB-1075	2026-06-05	Payment	Logistics & Operations Vendor	Equipment Packaging	EXP-1075	Expense disbursed for Equipment Packaging	0.00	2035.00	2035.00	Bank Transfer	t	Admin	2026-10-24 09:37:39.892973+05:30	2026-10-24 09:37:39.892973+05:30
83	comp_mann	BRD-02	CB-1076	2026-06-05	Receipt	Gujarat State Fertilizers & Chemicals	Counter Sales	INV-2026-1057	Payment received against invoice INV-2026-1057	129498.00	0.00	129498.00	Card	t	Admin	2026-10-24 09:37:39.89412+05:30	2026-10-24 09:37:39.89412+05:30
84	comp_mann	AMD-01	CB-1077	2026-06-06	Receipt	L&T Knowledge City Complex	Counter Sales	INV-2026-1058	Payment received against invoice INV-2026-1058	18880.94	0.00	18880.94	Cash	t	Admin	2026-10-24 09:37:39.895568+05:30	2026-10-24 09:37:39.895568+05:30
85	comp_mann	AMD-01	CB-1078	2026-06-07	Receipt	Amul Dairy Technical Facilities	Counter Sales	INV-2026-1059	Payment received against invoice INV-2026-1059	326963.24	0.00	326963.24	Bank Transfer	t	Admin	2026-10-24 09:37:39.898228+05:30	2026-10-24 09:37:39.898228+05:30
86	comp_mann	AMD-01	CB-1079	2026-06-07	Payment	Logistics & Operations Vendor	Branch Maintenance	EXP-1079	Expense disbursed for Branch Maintenance	0.00	3051.00	3051.00	Bank Transfer	t	Admin	2026-10-24 09:37:39.898686+05:30	2026-10-24 09:37:39.898686+05:30
87	comp_mann	AMD-01	CB-1080	2026-06-08	Receipt	Zydus Lifesciences Biotech Park	Counter Sales	INV-2026-1060	Payment received against invoice INV-2026-1060	41335.40	0.00	41335.40	Cash	t	Admin	2026-10-24 09:37:39.900231+05:30	2026-10-24 09:37:39.900231+05:30
88	comp_mashtech	SRU-02	CB-1081	2026-06-09	Receipt	Reliance Industries Ltd (Hazira Complex)	Counter Sales	INV-2026-1061	Payment received against invoice INV-2026-1061	19662.00	0.00	19662.00	UPI	t	Admin	2026-10-24 09:37:39.902029+05:30	2026-10-24 09:37:39.902029+05:30
89	comp_mashtech	AND-01	CB-1082	2026-06-09	Receipt	Alembic Pharmaceuticals Limited	Counter Sales	INV-2026-1062	Payment received against invoice INV-2026-1062	905.06	0.00	905.06	Cash	t	Admin	2026-10-24 09:37:39.903436+05:30	2026-10-24 09:37:39.903436+05:30
90	comp_mashtech	AND-01	CB-1083	2026-06-09	Payment	Logistics & Operations Vendor	Branch Maintenance	EXP-1083	Expense disbursed for Branch Maintenance	0.00	2841.00	2841.00	Bank Transfer	t	Admin	2026-10-24 09:37:39.903865+05:30	2026-10-24 09:37:39.903865+05:30
91	comp_mashtech	AND-01	CB-1084	2026-06-09	Receipt	Torrent Pharmaceuticals Ltd	Counter Sales	INV-2026-1063	Payment received against invoice INV-2026-1063	20579.56	0.00	20579.56	Card	t	Admin	2026-10-24 09:37:39.905862+05:30	2026-10-24 09:37:39.905862+05:30
92	comp_mashtech	SRU-02	CB-1085	2026-06-10	Receipt	Tata Motors Manufacturing Plant	Counter Sales	INV-2026-1064	Payment received against invoice INV-2026-1064	4525.30	0.00	4525.30	Cash	t	Admin	2026-10-24 09:37:39.907747+05:30	2026-10-24 09:37:39.907747+05:30
93	comp_mann	BRD-02	CB-1086	2026-06-10	Receipt	L&T Knowledge City Complex	Counter Sales	INV-2026-1065	Payment received against invoice INV-2026-1065	80659.40	0.00	80659.40	UPI	t	Admin	2026-10-24 09:37:39.910243+05:30	2026-10-24 09:37:39.910243+05:30
94	comp_mann	BRD-02	CB-1087	2026-06-10	Payment	Logistics & Operations Vendor	Equipment Packaging	EXP-1087	Expense disbursed for Equipment Packaging	0.00	9939.00	9939.00	Bank Transfer	t	Admin	2026-10-24 09:37:39.910618+05:30	2026-10-24 09:37:39.910618+05:30
95	comp_mashtech	SRU-02	CB-1088	2026-06-11	Receipt	Adani Ports & Special Economic Zone	Counter Sales	INV-2026-1066	Payment received against invoice INV-2026-1066	14804.28	0.00	14804.28	UPI	t	Admin	2026-10-24 09:37:39.913736+05:30	2026-10-24 09:37:39.913736+05:30
96	comp_mann	AMD-01	CB-1089	2026-06-11	Receipt	Reliance Industries Ltd (Hazira Complex)	Counter Sales	INV-2026-1067	Payment received against invoice INV-2026-1067	22401.12	0.00	22401.12	UPI	t	Admin	2026-10-24 09:37:39.915274+05:30	2026-10-24 09:37:39.915274+05:30
97	comp_mashtech	SRU-02	CB-1090	2026-06-12	Receipt	L&T Knowledge City Complex	Counter Sales	INV-2026-1068	Payment received against invoice INV-2026-1068	87471.04	0.00	87471.04	Bank Transfer	t	Admin	2026-10-24 09:37:39.919013+05:30	2026-10-24 09:37:39.919013+05:30
98	comp_mashtech	SRU-02	CB-1091	2026-06-12	Payment	Logistics & Operations Vendor	Utility & Electricity	EXP-1091	Expense disbursed for Utility & Electricity	0.00	5215.00	5215.00	Bank Transfer	t	Admin	2026-10-24 09:37:39.919732+05:30	2026-10-24 09:37:39.919732+05:30
99	comp_mann	AMD-01	CB-1092	2026-06-12	Receipt	Zydus Lifesciences Biotech Park	Counter Sales	INV-2026-1069	Payment received against invoice INV-2026-1069	27981.06	0.00	27981.06	Cash	t	Admin	2026-10-24 09:37:39.922371+05:30	2026-10-24 09:37:39.922371+05:30
100	comp_mann	AMD-01	CB-1093	2026-06-13	Receipt	Tata Motors Manufacturing Plant	Counter Sales	INV-2026-1070	Payment received against invoice INV-2026-1070	283033.36	0.00	283033.36	Cash	t	Admin	2026-10-24 09:37:39.925432+05:30	2026-10-24 09:37:39.925432+05:30
101	comp_mann	AMD-01	CB-1094	2026-06-15	Receipt	Shreeji Industrial Safety Systems	Counter Sales	INV-2026-1071	Payment received against invoice INV-2026-1071	14878.50	0.00	14878.50	UPI	t	Admin	2026-10-24 09:37:39.929598+05:30	2026-10-24 09:37:39.929598+05:30
102	comp_mann	AMD-01	CB-1095	2026-06-15	Payment	Logistics & Operations Vendor	Safety Inspection Fee	EXP-1095	Expense disbursed for Safety Inspection Fee	0.00	2086.00	2086.00	Bank Transfer	t	Admin	2026-10-24 09:37:39.930389+05:30	2026-10-24 09:37:39.930389+05:30
103	comp_mann	AMD-01	CB-1096	2026-06-16	Receipt	Reliance Industries Ltd (Hazira Complex)	Counter Sales	INV-2026-1072	Payment received against invoice INV-2026-1072	4678.46	0.00	4678.46	Bank Transfer	t	Admin	2026-10-24 09:37:39.933351+05:30	2026-10-24 09:37:39.933351+05:30
104	comp_mashtech	AND-01	CB-1097	2026-06-16	Receipt	Shreeji Industrial Safety Systems	Counter Sales	INV-2026-1073	Payment received against invoice INV-2026-1073	106898.00	0.00	106898.00	UPI	t	Admin	2026-10-24 09:37:39.937705+05:30	2026-10-24 09:37:39.937705+05:30
105	comp_mann	AMD-01	CB-1098	2026-06-17	Receipt	Adani Ports & Special Economic Zone	Counter Sales	INV-2026-1074	Payment received against invoice INV-2026-1074	121305.50	0.00	121305.50	Card	t	Admin	2026-10-24 09:37:39.941317+05:30	2026-10-24 09:37:39.941317+05:30
106	comp_mann	AMD-01	CB-1099	2026-06-17	Payment	Logistics & Operations Vendor	Warehouse Freight	EXP-1099	Expense disbursed for Warehouse Freight	0.00	5558.00	5558.00	Bank Transfer	t	Admin	2026-10-24 09:37:39.942139+05:30	2026-10-24 09:37:39.942139+05:30
107	comp_mann	AMD-01	CB-1100	2026-06-17	Receipt	Tata Motors Manufacturing Plant	Counter Sales	INV-2026-1075	Payment received against invoice INV-2026-1075	34727.16	0.00	34727.16	UPI	t	Admin	2026-10-24 09:37:39.946203+05:30	2026-10-24 09:37:39.946203+05:30
108	comp_mann	BRD-02	CB-1101	2026-06-18	Receipt	L&T Knowledge City Complex	Counter Sales	INV-2026-1076	Payment received against invoice INV-2026-1076	37216.55	0.00	37216.55	Bank Transfer	t	Admin	2026-10-24 09:37:39.951188+05:30	2026-10-24 09:37:39.951188+05:30
109	comp_mashtech	SRU-02	CB-1102	2026-06-18	Receipt	Tata Motors Manufacturing Plant	Counter Sales	INV-2026-1077	Payment received against invoice INV-2026-1077	39866.40	0.00	39866.40	Cash	t	Admin	2026-10-24 09:37:39.953692+05:30	2026-10-24 09:37:39.953692+05:30
110	comp_mashtech	SRU-02	CB-1103	2026-06-18	Payment	Logistics & Operations Vendor	Branch Maintenance	EXP-1103	Expense disbursed for Branch Maintenance	0.00	5758.00	5758.00	Bank Transfer	t	Admin	2026-10-24 09:37:39.954546+05:30	2026-10-24 09:37:39.954546+05:30
111	comp_mashtech	AND-01	CB-1104	2026-06-18	Receipt	Torrent Pharmaceuticals Ltd	Counter Sales	INV-2026-1078	Payment received against invoice INV-2026-1078	41599.82	0.00	41599.82	Cash	t	Admin	2026-10-24 09:37:39.957242+05:30	2026-10-24 09:37:39.957242+05:30
112	comp_mann	AMD-01	CB-1105	2026-06-19	Receipt	Adani Ports & Special Economic Zone	Counter Sales	INV-2026-1079	Payment received against invoice INV-2026-1079	62715.00	0.00	62715.00	Card	t	Admin	2026-10-24 09:37:39.958739+05:30	2026-10-24 09:37:39.958739+05:30
113	comp_mann	BRD-02	CB-1106	2026-06-21	Receipt	L&T Knowledge City Complex	Counter Sales	INV-2026-1080	Payment received against invoice INV-2026-1080	26134.64	0.00	26134.64	UPI	t	Admin	2026-10-24 09:37:39.961288+05:30	2026-10-24 09:37:39.961288+05:30
114	comp_mann	BRD-02	CB-1107	2026-06-21	Payment	Logistics & Operations Vendor	Warehouse Freight	EXP-1107	Expense disbursed for Warehouse Freight	0.00	8634.00	8634.00	Bank Transfer	t	Admin	2026-10-24 09:37:39.961921+05:30	2026-10-24 09:37:39.961921+05:30
115	comp_mashtech	SRU-02	CB-1108	2026-06-22	Receipt	Gujarat State Fertilizers & Chemicals	Counter Sales	INV-2026-1081	Payment received against invoice INV-2026-1081	4678.46	0.00	4678.46	Bank Transfer	t	Admin	2026-10-24 09:37:39.964465+05:30	2026-10-24 09:37:39.964465+05:30
116	comp_mann	AMD-01	CB-1109	2026-06-22	Receipt	Tata Motors Manufacturing Plant	Counter Sales	INV-2026-1082	Payment received against invoice INV-2026-1082	395368.92	0.00	395368.92	Cash	t	Admin	2026-10-24 09:37:39.967632+05:30	2026-10-24 09:37:39.967632+05:30
117	comp_mann	AMD-01	CB-1110	2026-06-22	Receipt	Alembic Pharmaceuticals Limited	Counter Sales	INV-2026-1083	Payment received against invoice INV-2026-1083	1531.64	0.00	1531.64	UPI	t	Admin	2026-10-24 09:37:39.969881+05:30	2026-10-24 09:37:39.969881+05:30
118	comp_mann	AMD-01	CB-1111	2026-06-22	Payment	Logistics & Operations Vendor	Branch Maintenance	EXP-1111	Expense disbursed for Branch Maintenance	0.00	5494.00	5494.00	Bank Transfer	t	Admin	2026-10-24 09:37:39.970249+05:30	2026-10-24 09:37:39.970249+05:30
119	comp_mann	BRD-02	CB-1112	2026-06-23	Receipt	Zydus Lifesciences Biotech Park	Counter Sales	INV-2026-1084	Payment received against invoice INV-2026-1084	57399.48	0.00	57399.48	UPI	t	Admin	2026-10-24 09:37:39.973581+05:30	2026-10-24 09:37:39.973581+05:30
120	comp_mann	BRD-02	CB-1113	2026-06-23	Receipt	Amul Dairy Technical Facilities	Counter Sales	INV-2026-1085	Payment received against invoice INV-2026-1085	1810.12	0.00	1810.12	Bank Transfer	t	Admin	2026-10-24 09:37:39.97562+05:30	2026-10-24 09:37:39.97562+05:30
121	comp_mashtech	AND-01	CB-1114	2026-06-23	Receipt	Amul Dairy Technical Facilities	Counter Sales	INV-2026-1086	Payment received against invoice INV-2026-1086	59802.99	0.00	59802.99	Cash	t	Admin	2026-10-24 09:37:39.978285+05:30	2026-10-24 09:37:39.978285+05:30
122	comp_mashtech	AND-01	CB-1115	2026-06-23	Payment	Logistics & Operations Vendor	Utility & Electricity	EXP-1115	Expense disbursed for Utility & Electricity	0.00	2431.00	2431.00	Bank Transfer	t	Admin	2026-10-24 09:37:39.978773+05:30	2026-10-24 09:37:39.978773+05:30
123	comp_mashtech	AND-01	CB-1116	2026-06-24	Receipt	Reliance Industries Ltd (Hazira Complex)	Counter Sales	INV-2026-1087	Payment received against invoice INV-2026-1087	10916.42	0.00	10916.42	UPI	t	Admin	2026-10-24 09:37:39.980501+05:30	2026-10-24 09:37:39.980501+05:30
124	comp_mann	BRD-02	CB-1117	2026-06-25	Receipt	L&T Knowledge City Complex	Counter Sales	INV-2026-1088	Payment received against invoice INV-2026-1088	7240.48	0.00	7240.48	Bank Transfer	t	Admin	2026-10-24 09:37:39.982559+05:30	2026-10-24 09:37:39.982559+05:30
125	comp_mashtech	AND-01	CB-1118	2026-06-25	Receipt	Tata Motors Manufacturing Plant	Counter Sales	INV-2026-1089	Payment received against invoice INV-2026-1089	37305.82	0.00	37305.82	UPI	t	Admin	2026-10-24 09:37:39.985326+05:30	2026-10-24 09:37:39.985326+05:30
126	comp_mashtech	AND-01	CB-1119	2026-06-25	Payment	Logistics & Operations Vendor	Utility & Electricity	EXP-1119	Expense disbursed for Utility & Electricity	0.00	2358.00	2358.00	Bank Transfer	t	Admin	2026-10-24 09:37:39.986001+05:30	2026-10-24 09:37:39.986001+05:30
127	comp_mashtech	AND-01	CB-1120	2026-06-26	Receipt	Tata Motors Manufacturing Plant	Counter Sales	INV-2026-1090	Payment received against invoice INV-2026-1090	60803.04	0.00	60803.04	UPI	t	Admin	2026-10-24 09:37:39.989265+05:30	2026-10-24 09:37:39.989265+05:30
128	comp_mann	AMD-01	CB-1121	2026-06-26	Receipt	Torrent Pharmaceuticals Ltd	Counter Sales	INV-2026-1091	Payment received against invoice INV-2026-1091	109614.52	0.00	109614.52	Bank Transfer	t	Admin	2026-10-24 09:37:39.992341+05:30	2026-10-24 09:37:39.992341+05:30
129	comp_mann	AMD-01	CB-1122	2026-06-26	Receipt	Adani Ports & Special Economic Zone	Counter Sales	INV-2026-1092	Payment received against invoice INV-2026-1092	3905.68	0.00	3905.68	UPI	t	Admin	2026-10-24 09:37:39.996368+05:30	2026-10-24 09:37:39.996368+05:30
130	comp_mann	AMD-01	CB-1123	2026-06-26	Payment	Logistics & Operations Vendor	Equipment Packaging	EXP-1123	Expense disbursed for Equipment Packaging	0.00	9295.00	9295.00	Bank Transfer	t	Admin	2026-10-24 09:37:39.997067+05:30	2026-10-24 09:37:39.997067+05:30
131	comp_mashtech	AND-01	CB-1124	2026-06-27	Receipt	Shreeji Industrial Safety Systems	Counter Sales	INV-2026-1093	Payment received against invoice INV-2026-1093	8614.00	0.00	8614.00	UPI	t	Admin	2026-10-24 09:37:39.998718+05:30	2026-10-24 09:37:39.998718+05:30
132	comp_mann	AMD-01	CB-1125	2026-06-28	Receipt	Amul Dairy Technical Facilities	Counter Sales	INV-2026-1094	Payment received against invoice INV-2026-1094	50135.84	0.00	50135.84	UPI	t	Admin	2026-10-24 09:37:40.000867+05:30	2026-10-24 09:37:40.000867+05:30
133	comp_mashtech	SRU-02	CB-1126	2026-06-29	Receipt	Shreeji Industrial Safety Systems	Counter Sales	INV-2026-1095	Payment received against invoice INV-2026-1095	20086.88	0.00	20086.88	Bank Transfer	t	Admin	2026-10-24 09:37:40.003852+05:30	2026-10-24 09:37:40.003852+05:30
134	comp_mashtech	SRU-02	CB-1127	2026-06-29	Payment	Logistics & Operations Vendor	Warehouse Freight	EXP-1127	Expense disbursed for Warehouse Freight	0.00	8832.00	8832.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.004329+05:30	2026-10-24 09:37:40.004329+05:30
135	comp_mann	AMD-01	CB-1128	2026-06-30	Receipt	Reliance Industries Ltd (Hazira Complex)	Counter Sales	INV-2026-1096	Payment received against invoice INV-2026-1096	28476.00	0.00	28476.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.006334+05:30	2026-10-24 09:37:40.006334+05:30
136	comp_mann	BRD-02	CB-1129	2026-06-30	Receipt	Torrent Pharmaceuticals Ltd	Counter Sales	INV-2026-1097	Payment received against invoice INV-2026-1097	86220.13	0.00	86220.13	Card	t	Admin	2026-10-24 09:37:40.009106+05:30	2026-10-24 09:37:40.009106+05:30
137	comp_mann	AMD-01	CB-1130	2026-06-30	Receipt	L&T Knowledge City Complex	Counter Sales	INV-2026-1098	Payment received against invoice INV-2026-1098	3481.00	0.00	3481.00	Card	t	Admin	2026-10-24 09:37:40.011357+05:30	2026-10-24 09:37:40.011357+05:30
138	comp_mann	AMD-01	CB-1131	2026-06-30	Payment	Logistics & Operations Vendor	Safety Inspection Fee	EXP-1131	Expense disbursed for Safety Inspection Fee	0.00	2068.00	2068.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.011933+05:30	2026-10-24 09:37:40.011933+05:30
139	comp_mashtech	AND-01	CB-1132	2026-07-01	Receipt	Amul Dairy Technical Facilities	Counter Sales	INV-2026-1099	Payment received against invoice INV-2026-1099	454774.15	0.00	454774.15	UPI	t	Admin	2026-10-24 09:37:40.014839+05:30	2026-10-24 09:37:40.014839+05:30
140	comp_mashtech	AND-01	CB-1133	2026-07-01	Receipt	Gujarat State Fertilizers & Chemicals	Counter Sales	INV-2026-1100	Payment received against invoice INV-2026-1100	19452.27	0.00	19452.27	UPI	t	Admin	2026-10-24 09:37:40.018135+05:30	2026-10-24 09:37:40.018135+05:30
141	comp_mann	BRD-02	CB-1134	2026-07-02	Receipt	Tata Motors Manufacturing Plant	Counter Sales	INV-2026-1101	Payment received against invoice INV-2026-1101	12461.98	0.00	12461.98	UPI	t	Admin	2026-10-24 09:37:40.020876+05:30	2026-10-24 09:37:40.020876+05:30
142	comp_mann	BRD-02	CB-1135	2026-07-02	Payment	Logistics & Operations Vendor	Equipment Packaging	EXP-1135	Expense disbursed for Equipment Packaging	0.00	3506.00	3506.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.02149+05:30	2026-10-24 09:37:40.02149+05:30
143	comp_mann	AMD-01	CB-1136	2026-07-03	Receipt	L&T Knowledge City Complex	Counter Sales	INV-2026-1102	Payment received against invoice INV-2026-1102	149160.00	0.00	149160.00	Card	t	Admin	2026-10-24 09:37:40.024458+05:30	2026-10-24 09:37:40.024458+05:30
144	comp_mann	BRD-02	CB-1137	2026-07-03	Receipt	Shreeji Industrial Safety Systems	Counter Sales	INV-2026-1103	Payment received against invoice INV-2026-1103	70046.44	0.00	70046.44	Cash	t	Admin	2026-10-24 09:37:40.026937+05:30	2026-10-24 09:37:40.026937+05:30
145	comp_mashtech	SRU-02	CB-1138	2026-07-03	Receipt	Adani Ports & Special Economic Zone	Counter Sales	INV-2026-1104	Payment received against invoice INV-2026-1104	2715.18	0.00	2715.18	Bank Transfer	t	Admin	2026-10-24 09:37:40.02857+05:30	2026-10-24 09:37:40.02857+05:30
146	comp_mashtech	SRU-02	CB-1139	2026-07-03	Payment	Logistics & Operations Vendor	Equipment Packaging	EXP-1139	Expense disbursed for Equipment Packaging	0.00	9242.00	9242.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.029265+05:30	2026-10-24 09:37:40.029265+05:30
147	comp_mashtech	AND-01	CB-1140	2026-07-04	Receipt	Shreeji Industrial Safety Systems	Counter Sales	INV-2026-1105	Payment received against invoice INV-2026-1105	60457.26	0.00	60457.26	UPI	t	Admin	2026-10-24 09:37:40.032449+05:30	2026-10-24 09:37:40.032449+05:30
148	comp_mann	AMD-01	CB-1141	2026-07-05	Receipt	L&T Knowledge City Complex	Counter Sales	INV-2026-1106	Payment received against invoice INV-2026-1106	14111.97	0.00	14111.97	Card	t	Admin	2026-10-24 09:37:40.035277+05:30	2026-10-24 09:37:40.035277+05:30
149	comp_mashtech	AND-01	CB-1142	2026-07-06	Receipt	Gujarat State Fertilizers & Chemicals	Counter Sales	INV-2026-1107	Payment received against invoice INV-2026-1107	13367.04	0.00	13367.04	UPI	t	Admin	2026-10-24 09:37:40.03741+05:30	2026-10-24 09:37:40.03741+05:30
150	comp_mashtech	AND-01	CB-1143	2026-07-06	Payment	Logistics & Operations Vendor	Utility & Electricity	EXP-1143	Expense disbursed for Utility & Electricity	0.00	7120.00	7120.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.03806+05:30	2026-10-24 09:37:40.03806+05:30
151	comp_mann	BRD-02	CB-1144	2026-07-06	Receipt	Reliance Industries Ltd (Hazira Complex)	Counter Sales	INV-2026-1108	Payment received against invoice INV-2026-1108	39181.62	0.00	39181.62	Cash	t	Admin	2026-10-24 09:37:40.040285+05:30	2026-10-24 09:37:40.040285+05:30
152	comp_mann	AMD-01	CB-1145	2026-07-07	Receipt	Gujarat State Fertilizers & Chemicals	Counter Sales	INV-2026-1109	Payment received against invoice INV-2026-1109	7231.98	0.00	7231.98	Cash	t	Admin	2026-10-24 09:37:40.0425+05:30	2026-10-24 09:37:40.0425+05:30
153	comp_mann	AMD-01	CB-1146	2026-07-07	Receipt	Adani Ports & Special Economic Zone	Counter Sales	INV-2026-1110	Payment received against invoice INV-2026-1110	28863.59	0.00	28863.59	Card	t	Admin	2026-10-24 09:37:40.045073+05:30	2026-10-24 09:37:40.045073+05:30
154	comp_mann	AMD-01	CB-1147	2026-07-07	Payment	Logistics & Operations Vendor	Safety Inspection Fee	EXP-1147	Expense disbursed for Safety Inspection Fee	0.00	8690.00	8690.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.045678+05:30	2026-10-24 09:37:40.045678+05:30
155	comp_mann	AMD-01	CB-1148	2026-07-08	Receipt	Tata Motors Manufacturing Plant	Counter Sales	INV-2026-1111	Payment received against invoice INV-2026-1111	7022.18	0.00	7022.18	Bank Transfer	t	Admin	2026-10-24 09:37:40.050009+05:30	2026-10-24 09:37:40.050009+05:30
156	comp_mann	AMD-01	CB-1149	2026-07-09	Receipt	Tata Motors Manufacturing Plant	Counter Sales	INV-2026-1112	Payment received against invoice INV-2026-1112	83972.56	0.00	83972.56	UPI	t	Admin	2026-10-24 09:37:40.055402+05:30	2026-10-24 09:37:40.055402+05:30
157	comp_mann	AMD-01	CB-1150	2026-07-10	Receipt	Gujarat State Fertilizers & Chemicals	Counter Sales	INV-2026-1113	Payment received against invoice INV-2026-1113	31268.23	0.00	31268.23	Card	t	Admin	2026-10-24 09:37:40.058604+05:30	2026-10-24 09:37:40.058604+05:30
158	comp_mann	AMD-01	CB-1151	2026-07-10	Payment	Logistics & Operations Vendor	Utility & Electricity	EXP-1151	Expense disbursed for Utility & Electricity	0.00	2698.00	2698.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.059268+05:30	2026-10-24 09:37:40.059268+05:30
159	comp_mashtech	AND-01	CB-1152	2026-07-11	Receipt	Tata Motors Manufacturing Plant	Counter Sales	INV-2026-1114	Payment received against invoice INV-2026-1114	19379.50	0.00	19379.50	Card	t	Admin	2026-10-24 09:37:40.061234+05:30	2026-10-24 09:37:40.061234+05:30
160	comp_mann	AMD-01	CB-1153	2026-07-13	Receipt	Alembic Pharmaceuticals Limited	Counter Sales	INV-2026-1115	Payment received against invoice INV-2026-1115	24801.24	0.00	24801.24	UPI	t	Admin	2026-10-24 09:37:40.062812+05:30	2026-10-24 09:37:40.062812+05:30
161	comp_mann	BRD-02	CB-1154	2026-07-13	Receipt	Alembic Pharmaceuticals Limited	Counter Sales	INV-2026-1116	Payment received against invoice INV-2026-1116	33068.32	0.00	33068.32	UPI	t	Admin	2026-10-24 09:37:40.065607+05:30	2026-10-24 09:37:40.065607+05:30
162	comp_mann	BRD-02	CB-1155	2026-07-13	Payment	Logistics & Operations Vendor	Safety Inspection Fee	EXP-1155	Expense disbursed for Safety Inspection Fee	0.00	5122.00	5122.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.066246+05:30	2026-10-24 09:37:40.066246+05:30
163	comp_mann	AMD-01	CB-1156	2026-07-14	Receipt	Gujarat State Fertilizers & Chemicals	Counter Sales	INV-2026-1117	Payment received against invoice INV-2026-1117	45371.76	0.00	45371.76	Cash	t	Admin	2026-10-24 09:37:40.068192+05:30	2026-10-24 09:37:40.068192+05:30
164	comp_mann	AMD-01	CB-1157	2026-07-14	Receipt	Gujarat State Fertilizers & Chemicals	Counter Sales	INV-2026-1118	Payment received against invoice INV-2026-1118	12921.00	0.00	12921.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.069716+05:30	2026-10-24 09:37:40.069716+05:30
165	comp_mann	AMD-01	CB-1158	2026-07-14	Receipt	Torrent Pharmaceuticals Ltd	Counter Sales	INV-2026-1119	Payment received against invoice INV-2026-1119	71818.28	0.00	71818.28	UPI	t	Admin	2026-10-24 09:37:40.072734+05:30	2026-10-24 09:37:40.072734+05:30
166	comp_mann	AMD-01	CB-1159	2026-07-14	Payment	Logistics & Operations Vendor	Utility & Electricity	EXP-1159	Expense disbursed for Utility & Electricity	0.00	6601.00	6601.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.073327+05:30	2026-10-24 09:37:40.073327+05:30
167	comp_mann	BRD-02	CB-1160	2026-07-15	Receipt	L&T Knowledge City Complex	Counter Sales	INV-2026-1120	Payment received against invoice INV-2026-1120	331259.16	0.00	331259.16	Card	t	Admin	2026-10-24 09:37:40.075955+05:30	2026-10-24 09:37:40.075955+05:30
168	comp_mann	AMD-01	CB-1161	2026-07-15	Receipt	L&T Knowledge City Complex	Counter Sales	INV-2026-1121	Payment received against invoice INV-2026-1121	109610.00	0.00	109610.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.078373+05:30	2026-10-24 09:37:40.078373+05:30
169	comp_mashtech	SRU-02	CB-1162	2026-07-16	Receipt	Shreeji Industrial Safety Systems	Counter Sales	INV-2026-1122	Payment received against invoice INV-2026-1122	3063.28	0.00	3063.28	UPI	t	Admin	2026-10-24 09:37:40.080445+05:30	2026-10-24 09:37:40.080445+05:30
170	comp_mashtech	SRU-02	CB-1163	2026-07-16	Payment	Logistics & Operations Vendor	Safety Inspection Fee	EXP-1163	Expense disbursed for Safety Inspection Fee	0.00	9870.00	9870.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.080954+05:30	2026-10-24 09:37:40.080954+05:30
171	comp_mann	AMD-01	CB-1164	2026-07-16	Receipt	Reliance Industries Ltd (Hazira Complex)	Counter Sales	INV-2026-1123	Payment received against invoice INV-2026-1123	34364.54	0.00	34364.54	Card	t	Admin	2026-10-24 09:37:40.082811+05:30	2026-10-24 09:37:40.082811+05:30
172	comp_mashtech	SRU-02	CB-1165	2026-07-17	Receipt	Shreeji Industrial Safety Systems	Counter Sales	INV-2026-1124	Payment received against invoice INV-2026-1124	90541.25	0.00	90541.25	Bank Transfer	t	Admin	2026-10-24 09:37:40.085983+05:30	2026-10-24 09:37:40.085983+05:30
173	comp_mann	BRD-02	CB-1166	2026-07-17	Receipt	Reliance Industries Ltd (Hazira Complex)	Counter Sales	INV-2026-1125	Payment received against invoice INV-2026-1125	217903.55	0.00	217903.55	UPI	t	Admin	2026-10-24 09:37:40.088482+05:30	2026-10-24 09:37:40.088482+05:30
174	comp_mann	BRD-02	CB-1167	2026-07-17	Payment	Logistics & Operations Vendor	Branch Maintenance	EXP-1167	Expense disbursed for Branch Maintenance	0.00	9171.00	9171.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.089055+05:30	2026-10-24 09:37:40.089055+05:30
175	comp_mann	AMD-01	CB-1168	2026-07-18	Receipt	Gujarat State Fertilizers & Chemicals	Counter Sales	INV-2026-1126	Payment received against invoice INV-2026-1126	3481.00	0.00	3481.00	UPI	t	Admin	2026-10-24 09:37:40.091133+05:30	2026-10-24 09:37:40.091133+05:30
176	comp_mann	BRD-02	CB-1169	2026-07-19	Receipt	L&T Knowledge City Complex	Counter Sales	INV-2026-1127	Payment received against invoice INV-2026-1127	965747.72	0.00	965747.72	Cash	t	Admin	2026-10-24 09:37:40.094148+05:30	2026-10-24 09:37:40.094148+05:30
177	comp_mann	AMD-01	CB-1170	2026-07-20	Receipt	Zydus Lifesciences Biotech Park	Counter Sales	INV-2026-1128	Payment received against invoice INV-2026-1128	9322.00	0.00	9322.00	Card	t	Admin	2026-10-24 09:37:40.096451+05:30	2026-10-24 09:37:40.096451+05:30
178	comp_mann	AMD-01	CB-1171	2026-07-20	Payment	Logistics & Operations Vendor	Branch Maintenance	EXP-1171	Expense disbursed for Branch Maintenance	0.00	3783.00	3783.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.096894+05:30	2026-10-24 09:37:40.096894+05:30
179	comp_mashtech	SRU-02	CB-1172	2026-07-21	Receipt	Zydus Lifesciences Biotech Park	Counter Sales	INV-2026-1129	Payment received against invoice INV-2026-1129	3620.24	0.00	3620.24	Bank Transfer	t	Admin	2026-10-24 09:37:40.098765+05:30	2026-10-24 09:37:40.098765+05:30
180	comp_mann	AMD-01	CB-1173	2026-07-22	Receipt	Adani Ports & Special Economic Zone	Counter Sales	INV-2026-1130	Payment received against invoice INV-2026-1130	6344.03	0.00	6344.03	Bank Transfer	t	Admin	2026-10-24 09:37:40.101604+05:30	2026-10-24 09:37:40.101604+05:30
181	comp_mann	AMD-01	CB-1174	2026-07-22	Receipt	Shreeji Industrial Safety Systems	Counter Sales	INV-2026-1131	Payment received against invoice INV-2026-1131	83620.00	0.00	83620.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.105179+05:30	2026-10-24 09:37:40.105179+05:30
182	comp_mann	AMD-01	CB-1175	2026-07-22	Payment	Logistics & Operations Vendor	Safety Inspection Fee	EXP-1175	Expense disbursed for Safety Inspection Fee	0.00	7121.00	7121.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.106922+05:30	2026-10-24 09:37:40.106922+05:30
183	comp_mann	BRD-02	CB-1176	2026-07-22	Receipt	Torrent Pharmaceuticals Ltd	Counter Sales	INV-2026-1132	Payment received against invoice INV-2026-1132	25926.72	0.00	25926.72	Bank Transfer	t	Admin	2026-10-24 09:37:40.109207+05:30	2026-10-24 09:37:40.109207+05:30
184	comp_mashtech	AND-01	CB-1177	2026-07-23	Receipt	Adani Ports & Special Economic Zone	Counter Sales	INV-2026-1133	Payment received against invoice INV-2026-1133	46027.16	0.00	46027.16	UPI	t	Admin	2026-10-24 09:37:40.112317+05:30	2026-10-24 09:37:40.112317+05:30
185	comp_mann	AMD-01	CB-1178	2026-07-23	Receipt	Zydus Lifesciences Biotech Park	Counter Sales	INV-2026-1134	Payment received against invoice INV-2026-1134	27713.25	0.00	27713.25	Bank Transfer	t	Admin	2026-10-24 09:37:40.115512+05:30	2026-10-24 09:37:40.115512+05:30
186	comp_mann	AMD-01	CB-1179	2026-07-23	Payment	Logistics & Operations Vendor	Safety Inspection Fee	EXP-1179	Expense disbursed for Safety Inspection Fee	0.00	4708.00	4708.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.115952+05:30	2026-10-24 09:37:40.115952+05:30
187	comp_mann	BRD-02	CB-1180	2026-07-23	Receipt	Shreeji Industrial Safety Systems	Counter Sales	INV-2026-1135	Payment received against invoice INV-2026-1135	4594.92	0.00	4594.92	Cash	t	Admin	2026-10-24 09:37:40.117283+05:30	2026-10-24 09:37:40.117283+05:30
188	comp_mann	AMD-01	CB-1181	2026-07-24	Receipt	Shreeji Industrial Safety Systems	Counter Sales	INV-2026-1136	Payment received against invoice INV-2026-1136	343630.74	0.00	343630.74	Cash	t	Admin	2026-10-24 09:37:40.124312+05:30	2026-10-24 09:37:40.124312+05:30
189	comp_mann	AMD-01	CB-1182	2026-07-24	Receipt	Tata Motors Manufacturing Plant	Counter Sales	INV-2026-1137	Payment received against invoice INV-2026-1137	3118.98	0.00	3118.98	Bank Transfer	t	Admin	2026-10-24 09:37:40.125974+05:30	2026-10-24 09:37:40.125974+05:30
190	comp_mann	AMD-01	CB-1183	2026-07-24	Payment	Logistics & Operations Vendor	Utility & Electricity	EXP-1183	Expense disbursed for Utility & Electricity	0.00	7925.00	7925.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.12662+05:30	2026-10-24 09:37:40.12662+05:30
191	comp_mann	AMD-01	CB-1184	2026-07-24	Receipt	Alembic Pharmaceuticals Limited	Counter Sales	INV-2026-1138	Payment received against invoice INV-2026-1138	63815.62	0.00	63815.62	UPI	t	Admin	2026-10-24 09:37:40.130889+05:30	2026-10-24 09:37:40.130889+05:30
192	comp_mashtech	SRU-02	CB-1185	2026-07-26	Receipt	Alembic Pharmaceuticals Limited	Counter Sales	INV-2026-1139	Payment received against invoice INV-2026-1139	104525.00	0.00	104525.00	UPI	t	Admin	2026-10-24 09:37:40.132572+05:30	2026-10-24 09:37:40.132572+05:30
193	comp_mashtech	SRU-02	CB-1186	2026-07-27	Receipt	L&T Knowledge City Complex	Counter Sales	INV-2026-1140	Payment received against invoice INV-2026-1140	223370.49	0.00	223370.49	Bank Transfer	t	Admin	2026-10-24 09:37:40.1358+05:30	2026-10-24 09:37:40.1358+05:30
194	comp_mashtech	SRU-02	CB-1187	2026-07-27	Payment	Logistics & Operations Vendor	Equipment Packaging	EXP-1187	Expense disbursed for Equipment Packaging	0.00	9624.00	9624.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.136239+05:30	2026-10-24 09:37:40.136239+05:30
195	comp_mashtech	AND-01	CB-1188	2026-07-27	Receipt	Shreeji Industrial Safety Systems	Counter Sales	INV-2026-1141	Payment received against invoice INV-2026-1141	18581.72	0.00	18581.72	Card	t	Admin	2026-10-24 09:37:40.138679+05:30	2026-10-24 09:37:40.138679+05:30
196	comp_mann	AMD-01	CB-1189	2026-07-28	Receipt	Adani Ports & Special Economic Zone	Counter Sales	INV-2026-1142	Payment received against invoice INV-2026-1142	89874.78	0.00	89874.78	Cash	t	Admin	2026-10-24 09:37:40.141035+05:30	2026-10-24 09:37:40.141035+05:30
197	comp_mann	AMD-01	CB-1190	2026-07-29	Receipt	Torrent Pharmaceuticals Ltd	Counter Sales	INV-2026-1143	Payment received against invoice INV-2026-1143	17445.12	0.00	17445.12	Cash	t	Admin	2026-10-24 09:37:40.142553+05:30	2026-10-24 09:37:40.142553+05:30
198	comp_mann	AMD-01	CB-1191	2026-07-29	Payment	Logistics & Operations Vendor	Equipment Packaging	EXP-1191	Expense disbursed for Equipment Packaging	0.00	7297.00	7297.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.142928+05:30	2026-10-24 09:37:40.142928+05:30
199	comp_mashtech	AND-01	CB-1192	2026-07-29	Receipt	Zydus Lifesciences Biotech Park	Counter Sales	INV-2026-1144	Payment received against invoice INV-2026-1144	1810.12	0.00	1810.12	Bank Transfer	t	Admin	2026-10-24 09:37:40.144717+05:30	2026-10-24 09:37:40.144717+05:30
200	comp_mann	AMD-01	CB-1193	2026-07-29	Receipt	L&T Knowledge City Complex	Counter Sales	INV-2026-1145	Payment received against invoice INV-2026-1145	98681.77	0.00	98681.77	Bank Transfer	t	Admin	2026-10-24 09:37:40.146639+05:30	2026-10-24 09:37:40.146639+05:30
201	comp_mann	AMD-01	CB-1194	2026-07-30	Receipt	Gujarat State Fertilizers & Chemicals	Counter Sales	INV-2026-1146	Payment received against invoice INV-2026-1146	4594.92	0.00	4594.92	UPI	t	Admin	2026-10-24 09:37:40.148679+05:30	2026-10-24 09:37:40.148679+05:30
202	comp_mann	AMD-01	CB-1195	2026-07-30	Payment	Logistics & Operations Vendor	Safety Inspection Fee	EXP-1195	Expense disbursed for Safety Inspection Fee	0.00	8241.00	8241.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.149116+05:30	2026-10-24 09:37:40.149116+05:30
203	comp_mann	BRD-02	CB-1196	2026-07-30	Receipt	Alembic Pharmaceuticals Limited	Counter Sales	INV-2026-1147	Payment received against invoice INV-2026-1147	129606.48	0.00	129606.48	Bank Transfer	t	Admin	2026-10-24 09:37:40.150898+05:30	2026-10-24 09:37:40.150898+05:30
204	comp_mann	BRD-02	CB-1197	2026-07-30	Receipt	Amul Dairy Technical Facilities	Counter Sales	INV-2026-1148	Payment received against invoice INV-2026-1148	19000.95	0.00	19000.95	Bank Transfer	t	Admin	2026-10-24 09:37:40.15212+05:30	2026-10-24 09:37:40.15212+05:30
205	comp_mann	AMD-01	CB-1198	2026-07-31	Receipt	Shreeji Industrial Safety Systems	Counter Sales	INV-2026-1149	Payment received against invoice INV-2026-1149	66136.64	0.00	66136.64	Bank Transfer	t	Admin	2026-10-24 09:37:40.153141+05:30	2026-10-24 09:37:40.153141+05:30
206	comp_mann	AMD-01	CB-1199	2026-07-31	Payment	Logistics & Operations Vendor	Utility & Electricity	EXP-1199	Expense disbursed for Utility & Electricity	0.00	4822.00	4822.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.153648+05:30	2026-10-24 09:37:40.153648+05:30
207	comp_mann	AMD-01	CB-1200	2026-07-31	Receipt	Tata Motors Manufacturing Plant	Counter Sales	INV-2026-1150	Payment received against invoice INV-2026-1150	145706.72	0.00	145706.72	Bank Transfer	t	Admin	2026-10-24 09:37:40.156521+05:30	2026-10-24 09:37:40.156521+05:30
208	comp_mann	AMD-01	CB-1201	2026-08-01	Receipt	Tata Motors Manufacturing Plant	Counter Sales	INV-2026-1151	Payment received against invoice INV-2026-1151	563870.00	0.00	563870.00	UPI	t	Admin	2026-10-24 09:37:40.158544+05:30	2026-10-24 09:37:40.158544+05:30
209	comp_mashtech	SRU-02	CB-1202	2026-08-02	Receipt	Gujarat State Fertilizers & Chemicals	Counter Sales	INV-2026-1152	Payment received against invoice INV-2026-1152	6740.16	0.00	6740.16	Bank Transfer	t	Admin	2026-10-24 09:37:40.159685+05:30	2026-10-24 09:37:40.159685+05:30
210	comp_mashtech	SRU-02	CB-1203	2026-08-02	Payment	Logistics & Operations Vendor	Branch Maintenance	EXP-1203	Expense disbursed for Branch Maintenance	0.00	2692.00	2692.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.160025+05:30	2026-10-24 09:37:40.160025+05:30
211	comp_mann	AMD-01	CB-1204	2026-08-03	Receipt	Tata Motors Manufacturing Plant	Counter Sales	INV-2026-1153	Payment received against invoice INV-2026-1153	137377.26	0.00	137377.26	UPI	t	Admin	2026-10-24 09:37:40.161901+05:30	2026-10-24 09:37:40.161901+05:30
212	comp_mann	AMD-01	CB-1205	2026-08-04	Receipt	Torrent Pharmaceuticals Ltd	Counter Sales	INV-2026-1154	Payment received against invoice INV-2026-1154	67250.82	0.00	67250.82	Bank Transfer	t	Admin	2026-10-24 09:37:40.164371+05:30	2026-10-24 09:37:40.164371+05:30
213	comp_mashtech	SRU-02	CB-1206	2026-08-04	Receipt	Torrent Pharmaceuticals Ltd	Counter Sales	INV-2026-1155	Payment received against invoice INV-2026-1155	21934.54	0.00	21934.54	Bank Transfer	t	Admin	2026-10-24 09:37:40.166086+05:30	2026-10-24 09:37:40.166086+05:30
214	comp_mashtech	SRU-02	CB-1207	2026-08-04	Payment	Logistics & Operations Vendor	Branch Maintenance	EXP-1207	Expense disbursed for Branch Maintenance	0.00	6062.00	6062.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.16647+05:30	2026-10-24 09:37:40.16647+05:30
215	comp_mann	AMD-01	CB-1208	2026-08-04	Receipt	L&T Knowledge City Complex	Counter Sales	INV-2026-1156	Payment received against invoice INV-2026-1156	7658.20	0.00	7658.20	UPI	t	Admin	2026-10-24 09:37:40.168483+05:30	2026-10-24 09:37:40.168483+05:30
216	comp_mashtech	SRU-02	CB-1209	2026-08-05	Receipt	Zydus Lifesciences Biotech Park	Counter Sales	INV-2026-1157	Payment received against invoice INV-2026-1157	345364.16	0.00	345364.16	Bank Transfer	t	Admin	2026-10-24 09:37:40.170707+05:30	2026-10-24 09:37:40.170707+05:30
217	comp_mashtech	AND-01	CB-1210	2026-08-06	Receipt	Alembic Pharmaceuticals Limited	Counter Sales	INV-2026-1158	Payment received against invoice INV-2026-1158	77994.86	0.00	77994.86	Bank Transfer	t	Admin	2026-10-24 09:37:40.172507+05:30	2026-10-24 09:37:40.172507+05:30
218	comp_mashtech	AND-01	CB-1211	2026-08-06	Payment	Logistics & Operations Vendor	Equipment Packaging	EXP-1211	Expense disbursed for Equipment Packaging	0.00	6057.00	6057.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.173005+05:30	2026-10-24 09:37:40.173005+05:30
219	comp_mann	AMD-01	CB-1212	2026-08-07	Receipt	Alembic Pharmaceuticals Limited	Counter Sales	INV-2026-1159	Payment received against invoice INV-2026-1159	215830.00	0.00	215830.00	UPI	t	Admin	2026-10-24 09:37:40.174268+05:30	2026-10-24 09:37:40.174268+05:30
220	comp_mann	AMD-01	CB-1213	2026-08-09	Receipt	Reliance Industries Ltd (Hazira Complex)	Counter Sales	INV-2026-1160	Payment received against invoice INV-2026-1160	290034.84	0.00	290034.84	UPI	t	Admin	2026-10-24 09:37:40.176612+05:30	2026-10-24 09:37:40.176612+05:30
221	comp_mann	AMD-01	CB-1214	2026-08-10	Receipt	Reliance Industries Ltd (Hazira Complex)	Counter Sales	INV-2026-1161	Payment received against invoice INV-2026-1161	53833.20	0.00	53833.20	Cash	t	Admin	2026-10-24 09:37:40.178871+05:30	2026-10-24 09:37:40.178871+05:30
222	comp_mann	AMD-01	CB-1215	2026-08-10	Payment	Logistics & Operations Vendor	Safety Inspection Fee	EXP-1215	Expense disbursed for Safety Inspection Fee	0.00	9270.00	9270.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.17922+05:30	2026-10-24 09:37:40.17922+05:30
223	comp_mann	BRD-02	CB-1216	2026-08-10	Receipt	Gujarat State Fertilizers & Chemicals	Counter Sales	INV-2026-1162	Payment received against invoice INV-2026-1162	14815.14	0.00	14815.14	Bank Transfer	t	Admin	2026-10-24 09:37:40.18055+05:30	2026-10-24 09:37:40.18055+05:30
224	comp_mashtech	SRU-02	CB-1217	2026-08-10	Receipt	Torrent Pharmaceuticals Ltd	Counter Sales	INV-2026-1163	Payment received against invoice INV-2026-1163	56196.14	0.00	56196.14	UPI	t	Admin	2026-10-24 09:37:40.182734+05:30	2026-10-24 09:37:40.182734+05:30
225	comp_mashtech	SRU-02	CB-1218	2026-08-11	Receipt	Alembic Pharmaceuticals Limited	Counter Sales	INV-2026-1164	Payment received against invoice INV-2026-1164	8722.56	0.00	8722.56	Bank Transfer	t	Admin	2026-10-24 09:37:40.184158+05:30	2026-10-24 09:37:40.184158+05:30
226	comp_mashtech	SRU-02	CB-1219	2026-08-11	Payment	Logistics & Operations Vendor	Warehouse Freight	EXP-1219	Expense disbursed for Warehouse Freight	0.00	2271.00	2271.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.184479+05:30	2026-10-24 09:37:40.184479+05:30
227	comp_mann	BRD-02	CB-1220	2026-08-11	Receipt	Alembic Pharmaceuticals Limited	Counter Sales	INV-2026-1165	Payment received against invoice INV-2026-1165	6565.17	0.00	6565.17	Bank Transfer	t	Admin	2026-10-24 09:37:40.186444+05:30	2026-10-24 09:37:40.186444+05:30
228	comp_mann	AMD-01	CB-1221	2026-08-12	Receipt	Torrent Pharmaceuticals Ltd	Counter Sales	INV-2026-1166	Payment received against invoice INV-2026-1166	48602.43	0.00	48602.43	UPI	t	Admin	2026-10-24 09:37:40.189+05:30	2026-10-24 09:37:40.189+05:30
229	comp_mashtech	SRU-02	CB-1222	2026-08-13	Receipt	Alembic Pharmaceuticals Limited	Counter Sales	INV-2026-1167	Payment received against invoice INV-2026-1167	224420.26	0.00	224420.26	UPI	t	Admin	2026-10-24 09:37:40.190633+05:30	2026-10-24 09:37:40.190633+05:30
230	comp_mashtech	SRU-02	CB-1223	2026-08-13	Payment	Logistics & Operations Vendor	Safety Inspection Fee	EXP-1223	Expense disbursed for Safety Inspection Fee	0.00	2816.00	2816.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.19105+05:30	2026-10-24 09:37:40.19105+05:30
231	comp_mann	AMD-01	CB-1224	2026-08-13	Receipt	Reliance Industries Ltd (Hazira Complex)	Counter Sales	INV-2026-1168	Payment received against invoice INV-2026-1168	7658.20	0.00	7658.20	Cash	t	Admin	2026-10-24 09:37:40.192242+05:30	2026-10-24 09:37:40.192242+05:30
232	comp_mashtech	SRU-02	CB-1225	2026-08-14	Receipt	Torrent Pharmaceuticals Ltd	Counter Sales	INV-2026-1169	Payment received against invoice INV-2026-1169	226099.44	0.00	226099.44	UPI	t	Admin	2026-10-24 09:37:40.193507+05:30	2026-10-24 09:37:40.193507+05:30
233	comp_mann	BRD-02	CB-1226	2026-08-15	Receipt	Amul Dairy Technical Facilities	Counter Sales	INV-2026-1170	Payment received against invoice INV-2026-1170	8702.50	0.00	8702.50	Bank Transfer	t	Admin	2026-10-24 09:37:40.194609+05:30	2026-10-24 09:37:40.194609+05:30
234	comp_mann	BRD-02	CB-1227	2026-08-15	Payment	Logistics & Operations Vendor	Warehouse Freight	EXP-1227	Expense disbursed for Warehouse Freight	0.00	5373.00	5373.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.19497+05:30	2026-10-24 09:37:40.19497+05:30
235	comp_mann	AMD-01	CB-1228	2026-08-17	Receipt	Alembic Pharmaceuticals Limited	Counter Sales	INV-2026-1171	Payment received against invoice INV-2026-1171	149039.32	0.00	149039.32	Cash	t	Admin	2026-10-24 09:37:40.198709+05:30	2026-10-24 09:37:40.198709+05:30
236	comp_mann	AMD-01	CB-1229	2026-08-18	Receipt	Tata Motors Manufacturing Plant	Counter Sales	INV-2026-1172	Payment received against invoice INV-2026-1172	66136.64	0.00	66136.64	Bank Transfer	t	Admin	2026-10-24 09:37:40.199793+05:30	2026-10-24 09:37:40.199793+05:30
237	comp_mashtech	SRU-02	CB-1230	2026-08-18	Receipt	Tata Motors Manufacturing Plant	Counter Sales	INV-2026-1173	Payment received against invoice INV-2026-1173	307699.00	0.00	307699.00	UPI	t	Admin	2026-10-24 09:37:40.201212+05:30	2026-10-24 09:37:40.201212+05:30
238	comp_mashtech	SRU-02	CB-1231	2026-08-18	Payment	Logistics & Operations Vendor	Warehouse Freight	EXP-1231	Expense disbursed for Warehouse Freight	0.00	9043.00	9043.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.201602+05:30	2026-10-24 09:37:40.201602+05:30
239	comp_mashtech	AND-01	CB-1232	2026-08-19	Receipt	Adani Ports & Special Economic Zone	Counter Sales	INV-2026-1174	Payment received against invoice INV-2026-1174	72017.16	0.00	72017.16	Bank Transfer	t	Admin	2026-10-24 09:37:40.204194+05:30	2026-10-24 09:37:40.204194+05:30
240	comp_mann	BRD-02	CB-1233	2026-08-19	Receipt	Reliance Industries Ltd (Hazira Complex)	Counter Sales	INV-2026-1175	Payment received against invoice INV-2026-1175	147801.74	0.00	147801.74	UPI	t	Admin	2026-10-24 09:37:40.206135+05:30	2026-10-24 09:37:40.206135+05:30
241	comp_mann	BRD-02	CB-1234	2026-08-19	Receipt	Alembic Pharmaceuticals Limited	Counter Sales	INV-2026-1176	Payment received against invoice INV-2026-1176	57114.72	0.00	57114.72	Card	t	Admin	2026-10-24 09:37:40.208801+05:30	2026-10-24 09:37:40.208801+05:30
242	comp_mann	BRD-02	CB-1235	2026-08-19	Payment	Logistics & Operations Vendor	Utility & Electricity	EXP-1235	Expense disbursed for Utility & Electricity	0.00	5419.00	5419.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.209276+05:30	2026-10-24 09:37:40.209276+05:30
243	comp_mann	BRD-02	CB-1236	2026-08-20	Receipt	Gujarat State Fertilizers & Chemicals	Counter Sales	INV-2026-1177	Payment received against invoice INV-2026-1177	3063.28	0.00	3063.28	Bank Transfer	t	Admin	2026-10-24 09:37:40.211197+05:30	2026-10-24 09:37:40.211197+05:30
244	comp_mann	AMD-01	CB-1237	2026-08-20	Receipt	Zydus Lifesciences Biotech Park	Counter Sales	INV-2026-1178	Payment received against invoice INV-2026-1178	762695.76	0.00	762695.76	UPI	t	Admin	2026-10-24 09:37:40.213391+05:30	2026-10-24 09:37:40.213391+05:30
245	comp_mashtech	AND-01	CB-1238	2026-08-21	Receipt	Gujarat State Fertilizers & Chemicals	Counter Sales	INV-2026-1179	Payment received against invoice INV-2026-1179	25334.60	0.00	25334.60	Bank Transfer	t	Admin	2026-10-24 09:37:40.215234+05:30	2026-10-24 09:37:40.215234+05:30
246	comp_mashtech	AND-01	CB-1239	2026-08-21	Payment	Logistics & Operations Vendor	Warehouse Freight	EXP-1239	Expense disbursed for Warehouse Freight	0.00	8998.00	8998.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.215574+05:30	2026-10-24 09:37:40.215574+05:30
247	comp_mann	AMD-01	CB-1240	2026-08-21	Receipt	Reliance Industries Ltd (Hazira Complex)	Counter Sales	INV-2026-1180	Payment received against invoice INV-2026-1180	324187.96	0.00	324187.96	UPI	t	Admin	2026-10-24 09:37:40.219604+05:30	2026-10-24 09:37:40.219604+05:30
248	comp_mashtech	AND-01	CB-1241	2026-08-21	Receipt	Amul Dairy Technical Facilities	Counter Sales	INV-2026-1181	Payment received against invoice INV-2026-1181	7863.52	0.00	7863.52	Bank Transfer	t	Admin	2026-10-24 09:37:40.222269+05:30	2026-10-24 09:37:40.222269+05:30
249	comp_mann	AMD-01	CB-1242	2026-08-24	Receipt	L&T Knowledge City Complex	Counter Sales	INV-2026-1182	Payment received against invoice INV-2026-1182	37975.91	0.00	37975.91	UPI	t	Admin	2026-10-24 09:37:40.226222+05:30	2026-10-24 09:37:40.226222+05:30
250	comp_mann	AMD-01	CB-1243	2026-08-24	Payment	Logistics & Operations Vendor	Equipment Packaging	EXP-1243	Expense disbursed for Equipment Packaging	0.00	6162.00	6162.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.226858+05:30	2026-10-24 09:37:40.226858+05:30
251	comp_mashtech	SRU-02	CB-1244	2026-08-25	Receipt	Torrent Pharmaceuticals Ltd	Counter Sales	INV-2026-1183	Payment received against invoice INV-2026-1183	25000.12	0.00	25000.12	UPI	t	Admin	2026-10-24 09:37:40.229542+05:30	2026-10-24 09:37:40.229542+05:30
252	comp_mann	AMD-01	CB-1245	2026-08-26	Receipt	Gujarat State Fertilizers & Chemicals	Counter Sales	INV-2026-1184	Payment received against invoice INV-2026-1184	43961.52	0.00	43961.52	Bank Transfer	t	Admin	2026-10-24 09:37:40.232306+05:30	2026-10-24 09:37:40.232306+05:30
253	comp_mann	AMD-01	CB-1246	2026-08-26	Receipt	Tata Motors Manufacturing Plant	Counter Sales	INV-2026-1185	Payment received against invoice INV-2026-1185	13088.56	0.00	13088.56	Card	t	Admin	2026-10-24 09:37:40.234693+05:30	2026-10-24 09:37:40.234693+05:30
254	comp_mann	AMD-01	CB-1247	2026-08-26	Payment	Logistics & Operations Vendor	Warehouse Freight	EXP-1247	Expense disbursed for Warehouse Freight	0.00	4016.00	4016.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.235292+05:30	2026-10-24 09:37:40.235292+05:30
255	comp_mann	AMD-01	CB-1248	2026-08-27	Receipt	Reliance Industries Ltd (Hazira Complex)	Counter Sales	INV-2026-1186	Payment received against invoice INV-2026-1186	17114.72	0.00	17114.72	Cash	t	Admin	2026-10-24 09:37:40.238838+05:30	2026-10-24 09:37:40.238838+05:30
256	comp_mashtech	AND-01	CB-1249	2026-08-28	Receipt	Gujarat State Fertilizers & Chemicals	Counter Sales	INV-2026-1187	Payment received against invoice INV-2026-1187	17987.57	0.00	17987.57	Cash	t	Admin	2026-10-24 09:37:40.242316+05:30	2026-10-24 09:37:40.242316+05:30
257	comp_mann	AMD-01	CB-1250	2026-08-31	Receipt	Gujarat State Fertilizers & Chemicals	Counter Sales	INV-2026-1188	Payment received against invoice INV-2026-1188	163087.93	0.00	163087.93	UPI	t	Admin	2026-10-24 09:37:40.247293+05:30	2026-10-24 09:37:40.247293+05:30
258	comp_mann	AMD-01	CB-1251	2026-08-31	Payment	Logistics & Operations Vendor	Equipment Packaging	EXP-1251	Expense disbursed for Equipment Packaging	0.00	3013.00	3013.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.247824+05:30	2026-10-24 09:37:40.247824+05:30
259	comp_mashtech	SRU-02	CB-1252	2026-08-31	Receipt	Amul Dairy Technical Facilities	Counter Sales	INV-2026-1189	Payment received against invoice INV-2026-1189	41638.24	0.00	41638.24	Bank Transfer	t	Admin	2026-10-24 09:37:40.250281+05:30	2026-10-24 09:37:40.250281+05:30
260	comp_mann	AMD-01	CB-1253	2026-08-31	Receipt	Zydus Lifesciences Biotech Park	Counter Sales	INV-2026-1190	Payment received against invoice INV-2026-1190	2444.96	0.00	2444.96	Card	t	Admin	2026-10-24 09:37:40.252465+05:30	2026-10-24 09:37:40.252465+05:30
261	comp_mann	AMD-01	CB-1254	2026-09-01	Receipt	Tata Motors Manufacturing Plant	Counter Sales	INV-2026-1191	Payment received against invoice INV-2026-1191	23939.73	0.00	23939.73	Bank Transfer	t	Admin	2026-10-24 09:37:40.256541+05:30	2026-10-24 09:37:40.256541+05:30
262	comp_mann	AMD-01	CB-1255	2026-09-01	Payment	Logistics & Operations Vendor	Safety Inspection Fee	EXP-1255	Expense disbursed for Safety Inspection Fee	0.00	2941.00	2941.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.257239+05:30	2026-10-24 09:37:40.257239+05:30
263	comp_mann	BRD-02	CB-1256	2026-09-02	Receipt	Gujarat State Fertilizers & Chemicals	Counter Sales	INV-2026-1192	Payment received against invoice INV-2026-1192	21734.42	0.00	21734.42	Cash	t	Admin	2026-10-24 09:37:40.260817+05:30	2026-10-24 09:37:40.260817+05:30
264	comp_mann	AMD-01	CB-1257	2026-09-02	Receipt	Reliance Industries Ltd (Hazira Complex)	Counter Sales	INV-2026-1193	Payment received against invoice INV-2026-1193	31348.23	0.00	31348.23	Cash	t	Admin	2026-10-24 09:37:40.267958+05:30	2026-10-24 09:37:40.267958+05:30
265	comp_mann	AMD-01	CB-1258	2026-09-03	Receipt	Shreeji Industrial Safety Systems	Counter Sales	INV-2026-1194	Payment received against invoice INV-2026-1194	860146.96	0.00	860146.96	Bank Transfer	t	Admin	2026-10-24 09:37:40.270683+05:30	2026-10-24 09:37:40.270683+05:30
266	comp_mann	AMD-01	CB-1259	2026-09-03	Payment	Logistics & Operations Vendor	Equipment Packaging	EXP-1259	Expense disbursed for Equipment Packaging	0.00	4462.00	4462.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.271288+05:30	2026-10-24 09:37:40.271288+05:30
267	comp_mashtech	SRU-02	CB-1260	2026-09-03	Receipt	L&T Knowledge City Complex	Counter Sales	INV-2026-1195	Payment received against invoice INV-2026-1195	5430.36	0.00	5430.36	Cash	t	Admin	2026-10-24 09:37:40.273469+05:30	2026-10-24 09:37:40.273469+05:30
268	comp_mann	BRD-02	CB-1261	2026-09-04	Receipt	Gujarat State Fertilizers & Chemicals	Counter Sales	INV-2026-1196	Payment received against invoice INV-2026-1196	17445.12	0.00	17445.12	UPI	t	Admin	2026-10-24 09:37:40.276345+05:30	2026-10-24 09:37:40.276345+05:30
269	comp_mann	AMD-01	CB-1262	2026-09-07	Receipt	Reliance Industries Ltd (Hazira Complex)	Counter Sales	INV-2026-1197	Payment received against invoice INV-2026-1197	739743.20	0.00	739743.20	Cash	t	Admin	2026-10-24 09:37:40.279739+05:30	2026-10-24 09:37:40.279739+05:30
270	comp_mann	AMD-01	CB-1263	2026-09-07	Payment	Logistics & Operations Vendor	Utility & Electricity	EXP-1263	Expense disbursed for Utility & Electricity	0.00	9474.00	9474.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.28045+05:30	2026-10-24 09:37:40.28045+05:30
271	comp_mashtech	SRU-02	CB-1264	2026-09-08	Receipt	Reliance Industries Ltd (Hazira Complex)	Counter Sales	INV-2026-1198	Payment received against invoice INV-2026-1198	359396.50	0.00	359396.50	Bank Transfer	t	Admin	2026-10-24 09:37:40.283439+05:30	2026-10-24 09:37:40.283439+05:30
272	comp_mann	AMD-01	CB-1265	2026-09-08	Receipt	Torrent Pharmaceuticals Ltd	Counter Sales	INV-2026-1199	Payment received against invoice INV-2026-1199	345328.00	0.00	345328.00	Card	t	Admin	2026-10-24 09:37:40.285563+05:30	2026-10-24 09:37:40.285563+05:30
273	comp_mann	AMD-01	CB-1266	2026-09-08	Receipt	Torrent Pharmaceuticals Ltd	Counter Sales	INV-2026-1200	Payment received against invoice INV-2026-1200	313163.68	0.00	313163.68	Bank Transfer	t	Admin	2026-10-24 09:37:40.289336+05:30	2026-10-24 09:37:40.289336+05:30
274	comp_mann	AMD-01	CB-1267	2026-09-08	Payment	Logistics & Operations Vendor	Utility & Electricity	EXP-1267	Expense disbursed for Utility & Electricity	0.00	6013.00	6013.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.289808+05:30	2026-10-24 09:37:40.289808+05:30
275	comp_mann	BRD-02	CB-1268	2026-09-09	Receipt	Gujarat State Fertilizers & Chemicals	Counter Sales	INV-2026-1201	Payment received against invoice INV-2026-1201	33561.00	0.00	33561.00	UPI	t	Admin	2026-10-24 09:37:40.292325+05:30	2026-10-24 09:37:40.292325+05:30
276	comp_mann	AMD-01	CB-1269	2026-09-09	Receipt	Shreeji Industrial Safety Systems	Counter Sales	INV-2026-1202	Payment received against invoice INV-2026-1202	225086.96	0.00	225086.96	UPI	t	Admin	2026-10-24 09:37:40.294906+05:30	2026-10-24 09:37:40.294906+05:30
277	comp_mashtech	AND-01	CB-1270	2026-09-10	Receipt	Gujarat State Fertilizers & Chemicals	Counter Sales	INV-2026-1203	Payment received against invoice INV-2026-1203	39154.50	0.00	39154.50	Cash	t	Admin	2026-10-24 09:37:40.296621+05:30	2026-10-24 09:37:40.296621+05:30
278	comp_mashtech	AND-01	CB-1271	2026-09-10	Payment	Logistics & Operations Vendor	Branch Maintenance	EXP-1271	Expense disbursed for Branch Maintenance	0.00	8148.00	8148.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.29703+05:30	2026-10-24 09:37:40.29703+05:30
279	comp_mashtech	AND-01	CB-1272	2026-09-11	Receipt	Alembic Pharmaceuticals Limited	Counter Sales	INV-2026-1204	Payment received against invoice INV-2026-1204	7052.39	0.00	7052.39	Cash	t	Admin	2026-10-24 09:37:40.300048+05:30	2026-10-24 09:37:40.300048+05:30
280	comp_mann	BRD-02	CB-1273	2026-09-12	Receipt	Shreeji Industrial Safety Systems	Counter Sales	INV-2026-1205	Payment received against invoice INV-2026-1205	63338.76	0.00	63338.76	Bank Transfer	t	Admin	2026-10-24 09:37:40.3034+05:30	2026-10-24 09:37:40.3034+05:30
281	comp_mann	AMD-01	CB-1274	2026-09-13	Receipt	Reliance Industries Ltd (Hazira Complex)	Counter Sales	INV-2026-1206	Payment received against invoice INV-2026-1206	653239.44	0.00	653239.44	Cash	t	Admin	2026-10-24 09:37:40.305904+05:30	2026-10-24 09:37:40.305904+05:30
282	comp_mann	AMD-01	CB-1275	2026-09-13	Payment	Logistics & Operations Vendor	Utility & Electricity	EXP-1275	Expense disbursed for Utility & Electricity	0.00	5805.00	5805.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.306457+05:30	2026-10-24 09:37:40.306457+05:30
283	comp_mashtech	SRU-02	CB-1276	2026-09-14	Receipt	Amul Dairy Technical Facilities	Counter Sales	INV-2026-1207	Payment received against invoice INV-2026-1207	641096.69	0.00	641096.69	Card	t	Admin	2026-10-24 09:37:40.309214+05:30	2026-10-24 09:37:40.309214+05:30
284	comp_mann	AMD-01	CB-1277	2026-09-14	Receipt	Tata Motors Manufacturing Plant	Counter Sales	INV-2026-1208	Payment received against invoice INV-2026-1208	8632.88	0.00	8632.88	Cash	t	Admin	2026-10-24 09:37:40.310844+05:30	2026-10-24 09:37:40.310844+05:30
285	comp_mashtech	SRU-02	CB-1278	2026-09-14	Receipt	Shreeji Industrial Safety Systems	Counter Sales	INV-2026-1209	Payment received against invoice INV-2026-1209	56002.80	0.00	56002.80	Cash	t	Admin	2026-10-24 09:37:40.312503+05:30	2026-10-24 09:37:40.312503+05:30
286	comp_mashtech	SRU-02	CB-1279	2026-09-14	Payment	Logistics & Operations Vendor	Safety Inspection Fee	EXP-1279	Expense disbursed for Safety Inspection Fee	0.00	8595.00	8595.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.312921+05:30	2026-10-24 09:37:40.312921+05:30
287	comp_mann	AMD-01	CB-1280	2026-09-15	Receipt	Amul Dairy Technical Facilities	Counter Sales	INV-2026-1210	Payment received against invoice INV-2026-1210	62715.00	0.00	62715.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.315223+05:30	2026-10-24 09:37:40.315223+05:30
288	comp_mann	BRD-02	CB-1281	2026-09-15	Receipt	Gujarat State Fertilizers & Chemicals	Counter Sales	INV-2026-1211	Payment received against invoice INV-2026-1211	5430.36	0.00	5430.36	UPI	t	Admin	2026-10-24 09:37:40.317885+05:30	2026-10-24 09:37:40.317885+05:30
289	comp_mann	AMD-01	CB-1282	2026-09-15	Receipt	Shreeji Industrial Safety Systems	Counter Sales	INV-2026-1212	Payment received against invoice INV-2026-1212	391766.48	0.00	391766.48	UPI	t	Admin	2026-10-24 09:37:40.321137+05:30	2026-10-24 09:37:40.321137+05:30
290	comp_mann	AMD-01	CB-1283	2026-09-15	Payment	Logistics & Operations Vendor	Safety Inspection Fee	EXP-1283	Expense disbursed for Safety Inspection Fee	0.00	2675.00	2675.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.321833+05:30	2026-10-24 09:37:40.321833+05:30
291	comp_mashtech	SRU-02	CB-1284	2026-09-16	Receipt	L&T Knowledge City Complex	Counter Sales	INV-2026-1213	Payment received against invoice INV-2026-1213	568412.60	0.00	568412.60	Bank Transfer	t	Admin	2026-10-24 09:37:40.324959+05:30	2026-10-24 09:37:40.324959+05:30
292	comp_mann	AMD-01	CB-1285	2026-09-17	Receipt	Alembic Pharmaceuticals Limited	Counter Sales	INV-2026-1214	Payment received against invoice INV-2026-1214	57031.10	0.00	57031.10	UPI	t	Admin	2026-10-24 09:37:40.32837+05:30	2026-10-24 09:37:40.32837+05:30
293	comp_mashtech	SRU-02	CB-1286	2026-09-18	Receipt	Alembic Pharmaceuticals Limited	Counter Sales	INV-2026-1215	Payment received against invoice INV-2026-1215	11905.02	0.00	11905.02	Cash	t	Admin	2026-10-24 09:37:40.330958+05:30	2026-10-24 09:37:40.330958+05:30
294	comp_mashtech	SRU-02	CB-1287	2026-09-18	Payment	Logistics & Operations Vendor	Warehouse Freight	EXP-1287	Expense disbursed for Warehouse Freight	0.00	9590.00	9590.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.331507+05:30	2026-10-24 09:37:40.331507+05:30
295	comp_mashtech	SRU-02	CB-1288	2026-09-19	Receipt	Torrent Pharmaceuticals Ltd	Counter Sales	INV-2026-1216	Payment received against invoice INV-2026-1216	7402.14	0.00	7402.14	UPI	t	Admin	2026-10-24 09:37:40.334818+05:30	2026-10-24 09:37:40.334818+05:30
296	comp_mashtech	SRU-02	CB-1289	2026-09-20	Receipt	Reliance Industries Ltd (Hazira Complex)	Counter Sales	INV-2026-1217	Payment received against invoice INV-2026-1217	227220.40	0.00	227220.40	UPI	t	Admin	2026-10-24 09:37:40.337639+05:30	2026-10-24 09:37:40.337639+05:30
297	comp_mann	AMD-01	CB-1290	2026-09-21	Receipt	Adani Ports & Special Economic Zone	Counter Sales	INV-2026-1218	Payment received against invoice INV-2026-1218	31924.31	0.00	31924.31	Cash	t	Admin	2026-10-24 09:37:40.34033+05:30	2026-10-24 09:37:40.34033+05:30
298	comp_mann	AMD-01	CB-1291	2026-09-21	Payment	Logistics & Operations Vendor	Safety Inspection Fee	EXP-1291	Expense disbursed for Safety Inspection Fee	0.00	7512.00	7512.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.340902+05:30	2026-10-24 09:37:40.340902+05:30
299	comp_mann	AMD-01	CB-1292	2026-09-22	Receipt	Adani Ports & Special Economic Zone	Counter Sales	INV-2026-1219	Payment received against invoice INV-2026-1219	17445.12	0.00	17445.12	Bank Transfer	t	Admin	2026-10-24 09:37:40.343377+05:30	2026-10-24 09:37:40.343377+05:30
300	comp_mashtech	AND-01	CB-1293	2026-09-22	Receipt	Zydus Lifesciences Biotech Park	Counter Sales	INV-2026-1220	Payment received against invoice INV-2026-1220	66136.64	0.00	66136.64	Cash	t	Admin	2026-10-24 09:37:40.345374+05:30	2026-10-24 09:37:40.345374+05:30
301	comp_mann	BRD-02	CB-1294	2026-09-22	Receipt	Alembic Pharmaceuticals Limited	Counter Sales	INV-2026-1221	Payment received against invoice INV-2026-1221	48257.78	0.00	48257.78	Card	t	Admin	2026-10-24 09:37:40.348524+05:30	2026-10-24 09:37:40.348524+05:30
302	comp_mann	BRD-02	CB-1295	2026-09-22	Payment	Logistics & Operations Vendor	Equipment Packaging	EXP-1295	Expense disbursed for Equipment Packaging	0.00	6079.00	6079.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.349258+05:30	2026-10-24 09:37:40.349258+05:30
303	comp_mann	BRD-02	CB-1296	2026-09-23	Receipt	Shreeji Industrial Safety Systems	Counter Sales	INV-2026-1222	Payment received against invoice INV-2026-1222	18605.68	0.00	18605.68	Cash	t	Admin	2026-10-24 09:37:40.35208+05:30	2026-10-24 09:37:40.35208+05:30
304	comp_mann	BRD-02	CB-1297	2026-09-23	Receipt	Shreeji Industrial Safety Systems	Counter Sales	INV-2026-1223	Payment received against invoice INV-2026-1223	452434.60	0.00	452434.60	Cash	t	Admin	2026-10-24 09:37:40.355428+05:30	2026-10-24 09:37:40.355428+05:30
305	comp_mashtech	SRU-02	CB-1298	2026-09-24	Receipt	Shreeji Industrial Safety Systems	Counter Sales	INV-2026-1224	Payment received against invoice INV-2026-1224	56869.51	0.00	56869.51	UPI	t	Admin	2026-10-24 09:37:40.35873+05:30	2026-10-24 09:37:40.35873+05:30
306	comp_mashtech	SRU-02	CB-1299	2026-09-24	Payment	Logistics & Operations Vendor	Utility & Electricity	EXP-1299	Expense disbursed for Utility & Electricity	0.00	4678.00	4678.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.359363+05:30	2026-10-24 09:37:40.359363+05:30
307	comp_mann	BRD-02	CB-1300	2026-09-24	Receipt	Zydus Lifesciences Biotech Park	Counter Sales	INV-2026-1225	Payment received against invoice INV-2026-1225	53864.84	0.00	53864.84	Cash	t	Admin	2026-10-24 09:37:40.361376+05:30	2026-10-24 09:37:40.361376+05:30
308	comp_mann	AMD-01	CB-1301	2026-09-25	Receipt	Tata Motors Manufacturing Plant	Counter Sales	INV-2026-1226	Payment received against invoice INV-2026-1226	13269.93	0.00	13269.93	Bank Transfer	t	Admin	2026-10-24 09:37:40.36572+05:30	2026-10-24 09:37:40.36572+05:30
309	comp_mashtech	SRU-02	CB-1302	2026-09-27	Receipt	Adani Ports & Special Economic Zone	Counter Sales	INV-2026-1227	Payment received against invoice INV-2026-1227	13075.58	0.00	13075.58	Bank Transfer	t	Admin	2026-10-24 09:37:40.368141+05:30	2026-10-24 09:37:40.368141+05:30
310	comp_mashtech	SRU-02	CB-1303	2026-09-27	Payment	Logistics & Operations Vendor	Utility & Electricity	EXP-1303	Expense disbursed for Utility & Electricity	0.00	7239.00	7239.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.368667+05:30	2026-10-24 09:37:40.368667+05:30
311	comp_mann	AMD-01	CB-1304	2026-09-28	Receipt	Gujarat State Fertilizers & Chemicals	Counter Sales	INV-2026-1228	Payment received against invoice INV-2026-1228	57078.56	0.00	57078.56	Bank Transfer	t	Admin	2026-10-24 09:37:40.371777+05:30	2026-10-24 09:37:40.371777+05:30
312	comp_mann	BRD-02	CB-1305	2026-09-29	Receipt	Zydus Lifesciences Biotech Park	Counter Sales	INV-2026-1229	Payment received against invoice INV-2026-1229	4361.28	0.00	4361.28	UPI	t	Admin	2026-10-24 09:37:40.373408+05:30	2026-10-24 09:37:40.373408+05:30
313	comp_mashtech	SRU-02	CB-1306	2026-09-29	Receipt	L&T Knowledge City Complex	Counter Sales	INV-2026-1230	Payment received against invoice INV-2026-1230	3411.38	0.00	3411.38	UPI	t	Admin	2026-10-24 09:37:40.376779+05:30	2026-10-24 09:37:40.376779+05:30
314	comp_mashtech	SRU-02	CB-1307	2026-09-29	Payment	Logistics & Operations Vendor	Branch Maintenance	EXP-1307	Expense disbursed for Branch Maintenance	0.00	2689.00	2689.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.377423+05:30	2026-10-24 09:37:40.377423+05:30
315	comp_mashtech	AND-01	CB-1308	2026-09-30	Receipt	Amul Dairy Technical Facilities	Counter Sales	INV-2026-1231	Payment received against invoice INV-2026-1231	59999.61	0.00	59999.61	UPI	t	Admin	2026-10-24 09:37:40.380754+05:30	2026-10-24 09:37:40.380754+05:30
316	comp_mann	AMD-01	CB-1309	2026-09-30	Receipt	Reliance Industries Ltd (Hazira Complex)	Counter Sales	INV-2026-1232	Payment received against invoice INV-2026-1232	40267.10	0.00	40267.10	Bank Transfer	t	Admin	2026-10-24 09:37:40.383603+05:30	2026-10-24 09:37:40.383603+05:30
317	comp_mann	AMD-01	CB-1310	2026-10-01	Receipt	Shreeji Industrial Safety Systems	Counter Sales	INV-2026-1233	Payment received against invoice INV-2026-1233	54294.24	0.00	54294.24	Bank Transfer	t	Admin	2026-10-24 09:37:40.386207+05:30	2026-10-24 09:37:40.386207+05:30
318	comp_mann	AMD-01	CB-1311	2026-10-01	Payment	Logistics & Operations Vendor	Warehouse Freight	EXP-1311	Expense disbursed for Warehouse Freight	0.00	4215.00	4215.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.38675+05:30	2026-10-24 09:37:40.38675+05:30
319	comp_mann	AMD-01	CB-1312	2026-10-02	Receipt	Zydus Lifesciences Biotech Park	Counter Sales	INV-2026-1234	Payment received against invoice INV-2026-1234	8702.50	0.00	8702.50	UPI	t	Admin	2026-10-24 09:37:40.388034+05:30	2026-10-24 09:37:40.388034+05:30
320	comp_mashtech	SRU-02	CB-1313	2026-10-02	Receipt	Tata Motors Manufacturing Plant	Counter Sales	INV-2026-1235	Payment received against invoice INV-2026-1235	71139.15	0.00	71139.15	Bank Transfer	t	Admin	2026-10-24 09:37:40.389498+05:30	2026-10-24 09:37:40.389498+05:30
321	comp_mann	AMD-01	CB-1314	2026-10-05	Receipt	Gujarat State Fertilizers & Chemicals	Counter Sales	INV-2026-1236	Payment received against invoice INV-2026-1236	45058.07	0.00	45058.07	Cash	t	Admin	2026-10-24 09:37:40.392804+05:30	2026-10-24 09:37:40.392804+05:30
322	comp_mann	AMD-01	CB-1315	2026-10-05	Payment	Logistics & Operations Vendor	Warehouse Freight	EXP-1315	Expense disbursed for Warehouse Freight	0.00	2455.00	2455.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.393167+05:30	2026-10-24 09:37:40.393167+05:30
323	comp_mann	AMD-01	CB-1316	2026-10-06	Receipt	Adani Ports & Special Economic Zone	Counter Sales	INV-2026-1237	Payment received against invoice INV-2026-1237	640710.00	0.00	640710.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.394778+05:30	2026-10-24 09:37:40.394778+05:30
324	comp_mann	AMD-01	CB-1317	2026-10-06	Receipt	Tata Motors Manufacturing Plant	Counter Sales	INV-2026-1238	Payment received against invoice INV-2026-1238	30001.50	0.00	30001.50	Bank Transfer	t	Admin	2026-10-24 09:37:40.39692+05:30	2026-10-24 09:37:40.39692+05:30
325	comp_mashtech	SRU-02	CB-1318	2026-10-07	Receipt	Amul Dairy Technical Facilities	Counter Sales	INV-2026-1239	Payment received against invoice INV-2026-1239	74403.72	0.00	74403.72	UPI	t	Admin	2026-10-24 09:37:40.399096+05:30	2026-10-24 09:37:40.399096+05:30
326	comp_mashtech	SRU-02	CB-1319	2026-10-07	Payment	Logistics & Operations Vendor	Utility & Electricity	EXP-1319	Expense disbursed for Utility & Electricity	0.00	4161.00	4161.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.399522+05:30	2026-10-24 09:37:40.399522+05:30
327	comp_mann	BRD-02	CB-1320	2026-10-08	Receipt	Shreeji Industrial Safety Systems	Counter Sales	INV-2026-1240	Payment received against invoice INV-2026-1240	106346.56	0.00	106346.56	Card	t	Admin	2026-10-24 09:37:40.401602+05:30	2026-10-24 09:37:40.401602+05:30
328	comp_mashtech	AND-01	CB-1321	2026-10-09	Receipt	Adani Ports & Special Economic Zone	Counter Sales	INV-2026-1241	Payment received against invoice INV-2026-1241	85048.32	0.00	85048.32	UPI	t	Admin	2026-10-24 09:37:40.404248+05:30	2026-10-24 09:37:40.404248+05:30
329	comp_mann	AMD-01	CB-1322	2026-10-09	Receipt	Tata Motors Manufacturing Plant	Counter Sales	INV-2026-1242	Payment received against invoice INV-2026-1242	29068.12	0.00	29068.12	Bank Transfer	t	Admin	2026-10-24 09:37:40.4068+05:30	2026-10-24 09:37:40.4068+05:30
330	comp_mann	AMD-01	CB-1323	2026-10-09	Payment	Logistics & Operations Vendor	Safety Inspection Fee	EXP-1323	Expense disbursed for Safety Inspection Fee	0.00	3726.00	3726.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.407239+05:30	2026-10-24 09:37:40.407239+05:30
331	comp_mashtech	AND-01	CB-1324	2026-10-11	Receipt	Zydus Lifesciences Biotech Park	Counter Sales	INV-2026-1243	Payment received against invoice INV-2026-1243	268822.48	0.00	268822.48	UPI	t	Admin	2026-10-24 09:37:40.408871+05:30	2026-10-24 09:37:40.408871+05:30
332	comp_mann	AMD-01	CB-1325	2026-10-12	Receipt	Alembic Pharmaceuticals Limited	Counter Sales	INV-2026-1244	Payment received against invoice INV-2026-1244	224436.08	0.00	224436.08	UPI	t	Admin	2026-10-24 09:37:40.410648+05:30	2026-10-24 09:37:40.410648+05:30
333	comp_mashtech	SRU-02	CB-1326	2026-10-12	Receipt	Torrent Pharmaceuticals Ltd	Counter Sales	INV-2026-1245	Payment received against invoice INV-2026-1245	13814.26	0.00	13814.26	UPI	t	Admin	2026-10-24 09:37:40.413549+05:30	2026-10-24 09:37:40.413549+05:30
334	comp_mashtech	SRU-02	CB-1327	2026-10-12	Payment	Logistics & Operations Vendor	Safety Inspection Fee	EXP-1327	Expense disbursed for Safety Inspection Fee	0.00	2993.00	2993.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.413901+05:30	2026-10-24 09:37:40.413901+05:30
335	comp_mann	BRD-02	CB-1328	2026-10-13	Receipt	Shreeji Industrial Safety Systems	Counter Sales	INV-2026-1246	Payment received against invoice INV-2026-1246	22374.00	0.00	22374.00	Card	t	Admin	2026-10-24 09:37:40.415374+05:30	2026-10-24 09:37:40.415374+05:30
336	comp_mann	AMD-01	CB-1329	2026-10-13	Receipt	Torrent Pharmaceuticals Ltd	Counter Sales	INV-2026-1247	Payment received against invoice INV-2026-1247	34001.70	0.00	34001.70	UPI	t	Admin	2026-10-24 09:37:40.417577+05:30	2026-10-24 09:37:40.417577+05:30
337	comp_mashtech	AND-01	CB-1330	2026-10-13	Receipt	L&T Knowledge City Complex	Counter Sales	INV-2026-1248	Payment received against invoice INV-2026-1248	89604.48	0.00	89604.48	UPI	t	Admin	2026-10-24 09:37:40.419332+05:30	2026-10-24 09:37:40.419332+05:30
338	comp_mashtech	AND-01	CB-1331	2026-10-13	Payment	Logistics & Operations Vendor	Equipment Packaging	EXP-1331	Expense disbursed for Equipment Packaging	0.00	7279.00	7279.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.419802+05:30	2026-10-24 09:37:40.419802+05:30
339	comp_mann	BRD-02	CB-1332	2026-10-14	Receipt	Reliance Industries Ltd (Hazira Complex)	Counter Sales	INV-2026-1249	Payment received against invoice INV-2026-1249	28001.40	0.00	28001.40	Bank Transfer	t	Admin	2026-10-24 09:37:40.421784+05:30	2026-10-24 09:37:40.421784+05:30
340	comp_mann	AMD-01	CB-1333	2026-10-14	Receipt	Torrent Pharmaceuticals Ltd	Counter Sales	INV-2026-1250	Payment received against invoice INV-2026-1250	3620.24	0.00	3620.24	UPI	t	Admin	2026-10-24 09:37:40.422958+05:30	2026-10-24 09:37:40.422958+05:30
341	comp_mann	BRD-02	CB-1334	2026-10-15	Receipt	Alembic Pharmaceuticals Limited	Counter Sales	INV-2026-1251	Payment received against invoice INV-2026-1251	17600.88	0.00	17600.88	UPI	t	Admin	2026-10-24 09:37:40.425197+05:30	2026-10-24 09:37:40.425197+05:30
342	comp_mann	BRD-02	CB-1335	2026-10-15	Payment	Logistics & Operations Vendor	Equipment Packaging	EXP-1335	Expense disbursed for Equipment Packaging	0.00	7471.00	7471.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.425654+05:30	2026-10-24 09:37:40.425654+05:30
343	comp_mann	AMD-01	CB-1336	2026-10-15	Receipt	Shreeji Industrial Safety Systems	Counter Sales	INV-2026-1252	Payment received against invoice INV-2026-1252	58579.20	0.00	58579.20	Bank Transfer	t	Admin	2026-10-24 09:37:40.428037+05:30	2026-10-24 09:37:40.428037+05:30
344	comp_mann	BRD-02	CB-1337	2026-10-15	Receipt	L&T Knowledge City Complex	Counter Sales	INV-2026-1253	Payment received against invoice INV-2026-1253	13645.52	0.00	13645.52	Bank Transfer	t	Admin	2026-10-24 09:37:40.42932+05:30	2026-10-24 09:37:40.42932+05:30
345	comp_mann	AMD-01	CB-1338	2026-10-16	Receipt	Gujarat State Fertilizers & Chemicals	Counter Sales	INV-2026-1254	Payment received against invoice INV-2026-1254	12601.22	0.00	12601.22	Bank Transfer	t	Admin	2026-10-24 09:37:40.430681+05:30	2026-10-24 09:37:40.430681+05:30
346	comp_mann	AMD-01	CB-1339	2026-10-16	Payment	Logistics & Operations Vendor	Equipment Packaging	EXP-1339	Expense disbursed for Equipment Packaging	0.00	6048.00	6048.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.431052+05:30	2026-10-24 09:37:40.431052+05:30
347	comp_mashtech	AND-01	CB-1340	2026-10-16	Receipt	Torrent Pharmaceuticals Ltd	Counter Sales	INV-2026-1255	Payment received against invoice INV-2026-1255	32996.00	0.00	32996.00	UPI	t	Admin	2026-10-24 09:37:40.43284+05:30	2026-10-24 09:37:40.43284+05:30
348	comp_mashtech	SRU-02	CB-1341	2026-10-17	Receipt	Alembic Pharmaceuticals Limited	Counter Sales	INV-2026-1256	Payment received against invoice INV-2026-1256	3411.38	0.00	3411.38	Cash	t	Admin	2026-10-24 09:37:40.434568+05:30	2026-10-24 09:37:40.434568+05:30
349	comp_mann	BRD-02	CB-1342	2026-10-18	Receipt	Amul Dairy Technical Facilities	Counter Sales	INV-2026-1257	Payment received against invoice INV-2026-1257	72442.04	0.00	72442.04	Bank Transfer	t	Admin	2026-10-24 09:37:40.436241+05:30	2026-10-24 09:37:40.436241+05:30
350	comp_mann	BRD-02	CB-1343	2026-10-18	Payment	Logistics & Operations Vendor	Equipment Packaging	EXP-1343	Expense disbursed for Equipment Packaging	0.00	3686.00	3686.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.436795+05:30	2026-10-24 09:37:40.436795+05:30
351	comp_mann	AMD-01	CB-1344	2026-10-19	Receipt	Adani Ports & Special Economic Zone	Counter Sales	INV-2026-1258	Payment received against invoice INV-2026-1258	98820.76	0.00	98820.76	Cash	t	Admin	2026-10-24 09:37:40.438941+05:30	2026-10-24 09:37:40.438941+05:30
352	comp_mashtech	AND-01	CB-1345	2026-10-19	Receipt	Amul Dairy Technical Facilities	Counter Sales	INV-2026-1259	Payment received against invoice INV-2026-1259	17228.00	0.00	17228.00	Card	t	Admin	2026-10-24 09:37:40.440499+05:30	2026-10-24 09:37:40.440499+05:30
353	comp_mashtech	AND-01	CB-1346	2026-10-20	Receipt	Amul Dairy Technical Facilities	Counter Sales	INV-2026-1260	Payment received against invoice INV-2026-1260	640710.00	0.00	640710.00	Cash	t	Admin	2026-10-24 09:37:40.441685+05:30	2026-10-24 09:37:40.441685+05:30
354	comp_mashtech	AND-01	CB-1347	2026-10-20	Payment	Logistics & Operations Vendor	Equipment Packaging	EXP-1347	Expense disbursed for Equipment Packaging	0.00	9981.00	9981.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.44196+05:30	2026-10-24 09:37:40.44196+05:30
355	comp_mashtech	SRU-02	CB-1348	2026-10-20	Receipt	Tata Motors Manufacturing Plant	Counter Sales	INV-2026-1261	Payment received against invoice INV-2026-1261	18642.74	0.00	18642.74	Bank Transfer	t	Admin	2026-10-24 09:37:40.444599+05:30	2026-10-24 09:37:40.444599+05:30
356	comp_mann	AMD-01	CB-1349	2026-10-20	Receipt	Shreeji Industrial Safety Systems	Counter Sales	INV-2026-1262	Payment received against invoice INV-2026-1262	6822.76	0.00	6822.76	Card	t	Admin	2026-10-24 09:37:40.446135+05:30	2026-10-24 09:37:40.446135+05:30
357	comp_mann	AMD-01	CB-1350	2026-10-21	Receipt	Amul Dairy Technical Facilities	Counter Sales	INV-2026-1263	Payment received against invoice INV-2026-1263	17200.86	0.00	17200.86	Card	t	Admin	2026-10-24 09:37:40.448506+05:30	2026-10-24 09:37:40.448506+05:30
358	comp_mann	AMD-01	CB-1351	2026-10-21	Payment	Logistics & Operations Vendor	Warehouse Freight	EXP-1351	Expense disbursed for Warehouse Freight	0.00	9491.00	9491.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.448822+05:30	2026-10-24 09:37:40.448822+05:30
359	comp_mann	AMD-01	CB-1352	2026-10-21	Receipt	Zydus Lifesciences Biotech Park	Counter Sales	INV-2026-1264	Payment received against invoice INV-2026-1264	229897.37	0.00	229897.37	Card	t	Admin	2026-10-24 09:37:40.450462+05:30	2026-10-24 09:37:40.450462+05:30
360	comp_mann	AMD-01	CB-1353	2026-10-22	Receipt	Adani Ports & Special Economic Zone	Counter Sales	INV-2026-1265	Payment received against invoice INV-2026-1265	179873.40	0.00	179873.40	Card	t	Admin	2026-10-24 09:37:40.452929+05:30	2026-10-24 09:37:40.452929+05:30
361	comp_mann	AMD-01	CB-1354	2026-10-23	Receipt	Torrent Pharmaceuticals Ltd	Counter Sales	INV-2026-1266	Payment received against invoice INV-2026-1266	4525.30	0.00	4525.30	UPI	t	Admin	2026-10-24 09:37:40.454621+05:30	2026-10-24 09:37:40.454621+05:30
362	comp_mann	AMD-01	CB-1355	2026-10-23	Payment	Logistics & Operations Vendor	Safety Inspection Fee	EXP-1355	Expense disbursed for Safety Inspection Fee	0.00	4640.00	4640.00	Bank Transfer	t	Admin	2026-10-24 09:37:40.454926+05:30	2026-10-24 09:37:40.454926+05:30
363	comp_mashtech	AND-01	CB-1356	2026-10-23	Receipt	Reliance Industries Ltd (Hazira Complex)	Counter Sales	INV-2026-1267	Payment received against invoice INV-2026-1267	98658.27	0.00	98658.27	Bank Transfer	t	Admin	2026-10-24 09:37:40.456658+05:30	2026-10-24 09:37:40.456658+05:30
364	comp_mann	BRD-02	CB-1357	2026-10-23	Receipt	Shreeji Industrial Safety Systems	Counter Sales	INV-2026-1268	Payment received against invoice INV-2026-1268	858998.88	0.00	858998.88	UPI	t	Admin	2026-10-24 09:37:40.458304+05:30	2026-10-24 09:37:40.458304+05:30
\.


--
-- TOC entry 5451 (class 0 OID 25710)
-- Dependencies: 228
-- Data for Name: cat_sub; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cat_sub (id, tittle, sp_cat, type, created_at) FROM stdin;
1	PPE	PPE	category	2026-10-22 15:43:41.371527+05:30
2	Fire Equipment	FEM	category	2026-10-22 15:43:41.383299+05:30
3	Industrial Safety	IDS	category	2026-10-22 15:43:41.384726+05:30
4	Safety Shoes	SFS	subcategory	2026-10-22 15:43:41.385983+05:30
5	Mask	MA	subcategory	2026-10-22 15:43:41.387098+05:30
6	Fire Extinguisher	FES	subcategory	2026-10-22 15:43:41.388246+05:30
7	Safety Helmet	SHM	subcategory	2026-10-22 15:43:41.389539+05:30
8	Safety Gloves	GLV	subcategory	2026-10-22 15:53:42.895786+05:30
9	Electrical Safety	ES	category	2026-10-22 15:56:12.799748+05:30
10	Fire Hydrant	FH	subcategory	2026-10-22 16:04:35.520805+05:30
11	fe	FE	category	2026-10-23 23:18:03.101483+05:30
\.


--
-- TOC entry 5469 (class 0 OID 26070)
-- Dependencies: 246
-- Data for Name: chart_of_accounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chart_of_accounts (id, company_id, name, nature, account_group, opening_balance, current_balance, balance_type, child_ledgers_count, is_system_locked, notes, created_at, updated_at) FROM stdin;
1	comp_mann	Capital Account	EQUITY	Equity & Reserves	1500000.00	1500000.00	CR	2	t		2026-10-24 17:40:31.382118+05:30	2026-10-24 17:40:31.382118+05:30
2	comp_mann	Reserves & Surplus	EQUITY	Equity & Reserves	345000.00	345000.00	CR	2	t		2026-10-24 17:40:31.382118+05:30	2026-10-24 17:40:31.382118+05:30
3	comp_mann	Current Assets - Cash	ASSET	Cash & Liquid	124500.00	124500.00	DR	3	t		2026-10-24 17:40:31.382118+05:30	2026-10-24 17:40:31.382118+05:30
4	comp_mann	Current Assets - Bank	ASSET	Bank Accounts	845200.00	845200.00	DR	4	t		2026-10-24 17:40:31.382118+05:30	2026-10-24 17:40:31.382118+05:30
5	comp_mann	Sundry Debtors	ASSET	Trade Receivables	678900.00	678900.00	DR	12	f		2026-10-24 17:40:31.382118+05:30	2026-10-24 17:40:31.382118+05:30
6	comp_mann	Stock-in-Hand	ASSET	Inventory Asset	1456000.00	1456000.00	DR	1	t		2026-10-24 17:40:31.382118+05:30	2026-10-24 17:40:31.382118+05:30
7	comp_mann	Fixed Assets	ASSET	Fixed Assets	2240000.00	2240000.00	DR	5	f		2026-10-24 17:40:31.382118+05:30	2026-10-24 17:40:31.382118+05:30
8	comp_mann	Sundry Creditors	LIABILITY	Trade Payables	423100.00	423100.00	CR	8	f		2026-10-24 17:40:31.382118+05:30	2026-10-24 17:40:31.382118+05:30
9	comp_mann	Duties & Taxes	LIABILITY	Statutory Liabilities	187650.00	187650.00	CR	7	t		2026-10-24 17:40:31.382118+05:30	2026-10-24 17:40:31.382118+05:30
10	comp_mann	Sales Accounts	INCOME	Operating Revenue	4215000.00	4215000.00	CR	3	t		2026-10-24 17:40:31.382118+05:30	2026-10-24 17:40:31.382118+05:30
11	comp_mann	Purchase Accounts	EXPENSE	Cost of Goods Sold	2890000.00	2890000.00	DR	2	t		2026-10-24 17:40:31.382118+05:30	2026-10-24 17:40:31.382118+05:30
12	comp_mann	Indirect Expenses	EXPENSE	Operating Expenses	567800.00	567800.00	DR	9	f		2026-10-24 17:40:31.382118+05:30	2026-10-24 17:40:31.382118+05:30
13	comp_mashtech	Tech Capital Account	EQUITY	Equity & Reserves	1200000.00	1200000.00	CR	1	t		2026-10-24 17:40:31.382118+05:30	2026-10-24 17:40:31.382118+05:30
14	comp_mashtech	HDFC Bank - Current	ASSET	Bank Accounts	950000.00	950000.00	DR	2	t		2026-10-24 17:40:31.382118+05:30	2026-10-24 17:40:31.382118+05:30
15	comp_mashtech	Hardware Inventory Stock	ASSET	Inventory Asset	850000.00	850000.00	DR	1	t		2026-10-24 17:40:31.382118+05:30	2026-10-24 17:40:31.382118+05:30
16	comp_mashtech	Enterprise SaaS Revenue	INCOME	Operating Revenue	3100000.00	3100000.00	CR	2	t		2026-10-24 17:40:31.382118+05:30	2026-10-24 17:40:31.382118+05:30
17	comp_mashtech	Cloud Infrastructure Expenses	EXPENSE	Operating Expenses	420000.00	420000.00	DR	3	f		2026-10-24 17:40:31.382118+05:30	2026-10-24 17:40:31.382118+05:30
18	comp_mann	HDFC Bank Corporate - 002	ASSET	Current Assets - Bank	0.00	0.00	DR	1	f		2026-10-24 18:05:55.122332+05:30	2026-10-24 18:05:55.122332+05:30
19	comp_apexglobal_a1sf	Cash on Hand Vault	Asset	Cash & Bank Balances	25000.00	25000.00	Debit	0	f		2026-10-25 08:57:03.809317+05:30	2026-10-25 08:57:03.809317+05:30
20	comp_apexglobal_a1sf	Primary Commercial Bank Account	Asset	Bank Accounts	150000.00	150000.00	Debit	0	f		2026-10-25 08:57:03.809317+05:30	2026-10-25 08:57:03.809317+05:30
21	comp_apexglobal_a1sf	Stock & Inventory Ledger	Asset	Current Assets	85000.00	85000.00	Debit	0	f		2026-10-25 08:57:03.809317+05:30	2026-10-25 08:57:03.809317+05:30
22	comp_apexglobal_a1sf	Direct Sales Revenue	Revenue	Operating Revenue	0.00	0.00	Credit	0	f		2026-10-25 08:57:03.809317+05:30	2026-10-25 08:57:03.809317+05:30
23	comp_apexglobal_a1sf	Cost of Goods Sold (COGS)	Expense	Direct Cost of Sales	0.00	0.00	Debit	0	f		2026-10-25 08:57:03.809317+05:30	2026-10-25 08:57:03.809317+05:30
24	comp_zenithindu_vk4c	Cash on Hand Vault	Asset	Cash & Bank Balances	25000.00	25000.00	Debit	0	f		2026-10-25 09:02:14.545842+05:30	2026-10-25 09:02:14.545842+05:30
25	comp_zenithindu_vk4c	Primary Commercial Bank Account	Asset	Bank Accounts	150000.00	150000.00	Debit	0	f		2026-10-25 09:02:14.545842+05:30	2026-10-25 09:02:14.545842+05:30
26	comp_zenithindu_vk4c	Stock & Inventory Ledger	Asset	Current Assets	85000.00	85000.00	Debit	0	f		2026-10-25 09:02:14.545842+05:30	2026-10-25 09:02:14.545842+05:30
27	comp_zenithindu_vk4c	Direct Sales Revenue	Revenue	Operating Revenue	0.00	0.00	Credit	0	f		2026-10-25 09:02:14.545842+05:30	2026-10-25 09:02:14.545842+05:30
28	comp_zenithindu_vk4c	Cost of Goods Sold (COGS)	Expense	Direct Cost of Sales	0.00	0.00	Debit	0	f		2026-10-25 09:02:14.545842+05:30	2026-10-25 09:02:14.545842+05:30
29	comp_acmetechno_cajc	Cash on Hand Vault	Asset	Cash & Bank Balances	25000.00	25000.00	Debit	0	f		2026-10-25 09:05:50.198483+05:30	2026-10-25 09:05:50.198483+05:30
30	comp_acmetechno_cajc	Primary Commercial Bank Account	Asset	Bank Accounts	150000.00	150000.00	Debit	0	f		2026-10-25 09:05:50.198483+05:30	2026-10-25 09:05:50.198483+05:30
31	comp_acmetechno_cajc	Stock & Inventory Ledger	Asset	Current Assets	85000.00	85000.00	Debit	0	f		2026-10-25 09:05:50.198483+05:30	2026-10-25 09:05:50.198483+05:30
32	comp_acmetechno_cajc	Direct Sales Revenue	Revenue	Operating Revenue	0.00	0.00	Credit	0	f		2026-10-25 09:05:50.198483+05:30	2026-10-25 09:05:50.198483+05:30
33	comp_acmetechno_cajc	Cost of Goods Sold (COGS)	Expense	Direct Cost of Sales	0.00	0.00	Debit	0	f		2026-10-25 09:05:50.198483+05:30	2026-10-25 09:05:50.198483+05:30
34	comp_mannengine_s000	Cash on Hand Vault	Asset	Cash & Bank Balances	25000.00	25000.00	Debit	0	f		2026-10-25 09:25:03.672677+05:30	2026-10-25 09:25:03.672677+05:30
35	comp_mannengine_s000	Primary Commercial Bank Account	Asset	Bank Accounts	150000.00	150000.00	Debit	0	f		2026-10-25 09:25:03.672677+05:30	2026-10-25 09:25:03.672677+05:30
36	comp_mannengine_s000	Stock & Inventory Ledger	Asset	Current Assets	85000.00	85000.00	Debit	0	f		2026-10-25 09:25:03.672677+05:30	2026-10-25 09:25:03.672677+05:30
37	comp_mannengine_s000	Direct Sales Revenue	Revenue	Operating Revenue	0.00	0.00	Credit	0	f		2026-10-25 09:25:03.672677+05:30	2026-10-25 09:25:03.672677+05:30
38	comp_mannengine_s000	Cost of Goods Sold (COGS)	Expense	Direct Cost of Sales	0.00	0.00	Debit	0	f		2026-10-25 09:25:03.672677+05:30	2026-10-25 09:25:03.672677+05:30
\.


--
-- TOC entry 5482 (class 0 OID 26319)
-- Dependencies: 259
-- Data for Name: companies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.companies (id, tenant_id, name, legal_name, gstin, pan, address, pin_code, state, country, primary_color, currency, status, created_at, updated_at) FROM stdin;
comp_mann	comp_mann	Mann Engineers Fire Safety	Mann Engineers Fire Safety Pvt Ltd	24AABCM8921K1ZK	AABCM8921K				India	#0284c7	INR	ACTIVE	2026-10-25 08:32:48.367805+05:30	2026-10-25 08:32:48.367805+05:30
comp_mashtech	comp_mashtech	Mash Tech	Mash Tech Solutions Pvt Ltd	24AABCM9988T1Z9	AABCM9988T				India	#0284c7	INR	ACTIVE	2026-10-25 08:32:48.367805+05:30	2026-10-25 08:32:48.367805+05:30
comp_apexglobal_a1sf	comp_apexglobal_a1sf	Apex Global Enterprises	Apex Global Enterprises	24AABCA1234D1ZP	AABCA1234D	101 Cyber City, Surat	395007	Gujarat	India	#0284c7	INR	ACTIVE	2026-10-25 08:57:03.809317+05:30	2026-10-25 08:57:03.809317+05:30
comp_zenithindu_vk4c	comp_zenithindu_vk4c	Zenith Industrial Safety	Zenith Industrial Safety	24AAACZ1122K1Z9	AAACZ1122K	Plot 20, GIDC Industrial Estate, Halol	389350	Gujarat	India	#0284c7	INR	ACTIVE	2026-10-25 09:02:14.545842+05:30	2026-10-25 09:02:14.545842+05:30
comp_acmetechno_cajc	comp_acmetechno_cajc	Acme Technologies Pvt Ltd	Acme Technologies Pvt Ltd	27AABCU9603R1ZM	AABCU9603R	Unit 402, High-Tech Tower, BKC, Bandra	400051	Maharashtra	India	#0284c7	INR	ACTIVE	2026-10-25 09:05:50.198483+05:30	2026-10-25 09:05:50.198483+05:30
comp_mannengine_s000	comp_mannengine_s000	Mann Engineeers Vadod	Mann Engineeers Vadod	24AAKHM5573J1ZT	AAKHM5573J	MANNNDNKJKNEKNDK	389350	Gujarat	India	#0284c7	INR	ACTIVE	2026-10-25 09:25:03.672677+05:30	2026-10-25 09:25:03.672677+05:30
\.


--
-- TOC entry 5463 (class 0 OID 25964)
-- Dependencies: 240
-- Data for Name: customer_holds; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer_holds (id, hold_no, company_id, branch_code, customer_name, customer_phone, customer_email, item_code, item_name, qty, unit_price, total_amount, hold_date, expires_at, status, invoice_no, notes, created_by, created_at, updated_at) FROM stdin;
1	RSV-2026-000123	comp_mann	AMD-01	ABC Safety Solutions Pvt Ltd	+91 98250 88712	purchase@abcsafety.com	FE-ABC-4	ABC Dry Powder Extinguisher 4kg	3.00	1321.60	3964.80	2026-10-24 09:54:00.157753+05:30	2026-10-24 12:54:00.157753+05:30	ACTIVE		Customer requested counter hold until 4 PM payment release	Staff	2026-10-24 09:54:00.157753+05:30	2026-10-24 09:54:00.157753+05:30
2	RSV-2026-000124	comp_mann	AMD-01	Walk-in Client (Phone Hold)	+91 94280 11223	client@gmail.com	FE-CO2-2	CO2 Fire Extinguisher 2kg	1.00	2450.00	2450.00	2026-10-24 09:54:00.157753+05:30	2026-10-24 10:19:00.157753+05:30	EXPIRING_SOON		Urgent call-in booking for factory inspection	Staff	2026-10-24 09:54:00.157753+05:30	2026-10-24 09:54:00.157753+05:30
3	RSV-2026-000125	comp_mann	BRD-02	Gujarat Refinery Safety Dept	+91 99090 33445	safety@refinery.guj.gov	SH-M201	Industrial Safety Helmet Yellow	15.00	340.00	5100.00	2026-10-24 09:54:00.157753+05:30	2026-10-24 14:54:00.157753+05:30	ACTIVE		Holding against purchase approval memo	Staff	2026-10-24 09:54:00.157753+05:30	2026-10-24 09:54:00.157753+05:30
4	RSV-2026-000126	comp_mann	AMD-01	Mehta Textiles Mills	+91 98790 55667	store@mehtatextiles.com	SG-CL01	Anti-Fog Safety Goggles Clear	20.00	115.00	2300.00	2026-10-24 09:54:00.157753+05:30	2026-10-23 09:54:00.157753+05:30	BILLED		Billed and collected via POS INV-2026-0182	Staff	2026-10-24 09:54:00.157753+05:30	2026-10-24 09:54:00.157753+05:30
5	RSV-2026-000131	comp_mann	AMD-01	Patel Engineering	+91879061155	kmnbSDFj@gjbjh.o	CS-BOOT-9	Chemical Resistant Steel Toe Shoes S3	20.00	1321.60	26432.00	2026-10-24 22:48:50.028042+05:30	2026-10-25 02:48:50.028042+05:30	ACTIVE		N/A	Staff	2026-10-24 22:48:50.028042+05:30	2026-10-24 22:48:50.028042+05:30
\.


--
-- TOC entry 5445 (class 0 OID 25538)
-- Dependencies: 222
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customers (id, uid, company, name, phone, email, address, gstin, created_at, company_id) FROM stdin;
1	OC-001	Rajkot Heavy Industries Ltd	Rajesh Patel	9825012345	purchase@rajkotind.com	Plot 42, GIDC Lodhika, Rajkot, Gujarat	24AAACR1234F1Z5	2026-10-22 14:21:05.63328+05:30	comp_mann
2	OC-002	Ahmedabad Chemical Works	Pravin Shah	9879054321	accounts@ahmedabadchem.com	Phase 2, Vatva Industrial Estate, Ahmedabad	24AABCA5678B1Z2	2026-10-22 14:21:05.637316+05:30	comp_mann
3	OC-003	Reliance Jamnagar Complex	Vikram Mehta	9909011223	v.mehta@rilprocurement.com	Moti Khavdi, Jamnagar, Gujarat	24AABCR0001R1Z9	2026-10-22 14:21:05.638022+05:30	comp_mann
4	OC-004	L&T Construction Hazira	Sanjay Desai	9824099887	safety.hazira@larsentoubro.com	Hazira Manufacturing Complex, Surat, Gujarat	24AAACL0123L1Z4	2026-10-22 14:21:05.638499+05:30	comp_mann
5	OC-005	Adani Ports & SEZ Mundra	Amit Joshi	9925044556	procurement@adani.com	Navinal Island, Mundra, Kutch, Gujarat	24AABCA9988A1Z7	2026-10-22 14:21:05.638877+05:30	comp_mann
6	OC-006	Walk-in Retail Customer	Retail Walk-in	9876543210	counter@mannengineers.in	Counter Sales, Ahmedabad Central	URP	2026-10-22 14:21:05.639353+05:30	comp_mann
7	OC-548	MANN ENGINEERS	Mitesh Shah	9998282411		PLOT NO 14, RINKI CHOWKDI, HALOL, Panchmahals, Gujarat, PIN: 389350	24AAKHM5573J1ZT	2026-10-22 23:50:17.801578+05:30	comp_mann
8	OC-924	CHETAN TRADING COMPANY.	Harshil SHah	918799061155	ndj@jn.com	G/4, NR BUS STAND, HALOL, Panchmahals, Gujarat, PIN: 389350	24AHXPS3105L1ZV	2026-10-24 22:54:26.24317+05:30	comp_mann
\.


--
-- TOC entry 5479 (class 0 OID 26214)
-- Dependencies: 256
-- Data for Name: cycle_counts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cycle_counts (id, session_no, company_id, branch_code, count_mode, section, auditor_name, system_qty, physical_qty, variance_qty, status, session_date, notes, created_at) FROM stdin;
1	CNT-2025-014	comp_mann	AMD-01	Blind Count	Fire Extinguishers	Rajesh Patel	45	45	0	Tallied ⚖️	2026-10-24		2026-10-24 17:40:31.382118+05:30
2	CNT-2025-013	comp_mann	SUR-02	Spot Count	CO2 Cylinders	Amit Kumar	14	12	-2	Under Review	2026-10-24		2026-10-24 17:40:31.382118+05:30
3	CNT-2025-012	comp_mann	BRD-02	Full Stock Take	Entire Depot	Neha Desai	312	311	-1	Approved	2026-10-24		2026-10-24 17:40:31.382118+05:30
4	CNT-2025-004	comp_mann	AMD-01	Blind Count	Fire Extinguishers	Ahmedabad Central Hub Staff	48	47	-1	Under Review	2026-10-25	Automated test blind audit	2026-10-25 01:08:03.034284+05:30
5	CNT-2025-005	comp_mann	AMD-01	Blind Count	Safety Equipment	Branch Staff Mann	48	48	0	Tallied ⚖️	2026-10-25	Perfect count test	2026-10-25 01:15:10.878255+05:30
6	CNT-2025-006	comp_mann	AMD-01	Blind Count	Fire Extinguishers - ABC Dry Powder Fire Ext. 4kg	Mann Engineers Admin	47	14	-33	Variance Flagged	2026-10-25	Blind physical count on FE-ABC-4: 14 units counted vs ledger 47. Variance: -33	2026-10-25 01:20:12.92642+05:30
7	CNT-2025-007	comp_mann	AMD-01	Blind Count	Fire Extinguishers - ABC Dry Powder Fire Ext. 4kg	Mann Engineers Admin	47	47	0	Tallied ⚖️	2026-10-25	Blind physical count on FE-ABC-4: 47 units counted vs ledger 47. Variance: 0	2026-10-25 01:20:17.45316+05:30
8	CNT-2025-008	comp_mann	BRD-02	Blind Count	First Aid - First Aid Kit Industrial	Mann Engineers Admin	8	14	6	Variance Flagged	2026-10-25	Blind physical count on FA-KIT1: 14 units counted vs ledger 8. Variance: 6	2026-10-25 01:42:02.480745+05:30
9	CNT-2025-009	comp_mann	BRD-02	Blind Count	First Aid - First Aid Kit Industrial	Mann Engineers Admin	8	8	0	Tallied ⚖️	2026-10-25	Blind physical count on FA-KIT1: 8 units counted vs ledger 8. Variance: 0	2026-10-25 01:42:07.10627+05:30
10	CNT-2025-001	comp_mashtech	AND-01	Blind Count	3kVA Online UPS Pure Sine Wave 230V (UPS-3KVA-ON)	Lead Auditor	45	45	0	Tallied ⚖️	2026-10-25	Routine monthly verified inventory check	2026-10-25 10:32:01.727935+05:30
11	CNT-2025-002	comp_mashtech	AND-01	Cycle Count	3kVA Online UPS Pure Sine Wave 230V (UPS-3KVA-ON)	Lead Auditor	25	24	-1	Under Review	2026-10-25	Discrepancy of 1 unit in audit review	2026-10-25 10:32:01.727935+05:30
14	CNT-APEX-227	comp_apexglobal_a1sf	ASH-01	Blind Count	Commercial Starter Pack Item A (PRD-START-01)	Lead Auditor	45	45	0	Tallied ⚖️	2026-10-25	Routine monthly verified inventory check	2026-10-25 10:33:03.00033+05:30
15	CNT-APEX-550	comp_apexglobal_a1sf	ASH-01	Cycle Count	Commercial Starter Pack Item A (PRD-START-01)	Lead Auditor	25	24	-1	Under Review	2026-10-25	Discrepancy of 1 unit in audit review	2026-10-25 10:33:03.00033+05:30
16	CNT-ZENI-694	comp_zenithindu_vk4c	HCD-01	Blind Count	Commercial Starter Pack Item A (PRD-START-01)	Lead Auditor	45	45	0	Tallied ⚖️	2026-10-25	Routine monthly verified inventory check	2026-10-25 10:33:03.023206+05:30
17	CNT-ZENI-997	comp_zenithindu_vk4c	HCD-01	Cycle Count	Commercial Starter Pack Item A (PRD-START-01)	Lead Auditor	25	24	-1	Under Review	2026-10-25	Discrepancy of 1 unit in audit review	2026-10-25 10:33:03.023206+05:30
18	CNT-ACME-610	comp_acmetechno_cajc	MUM-01	Blind Count	Commercial Starter Pack Item A (PRD-START-01)	Lead Auditor	45	45	0	Tallied ⚖️	2026-10-25	Routine monthly verified inventory check	2026-10-25 10:33:03.047597+05:30
19	CNT-ACME-226	comp_acmetechno_cajc	MUM-01	Cycle Count	Commercial Starter Pack Item A (PRD-START-01)	Lead Auditor	25	24	-1	Under Review	2026-10-25	Discrepancy of 1 unit in audit review	2026-10-25 10:33:03.047597+05:30
20	CNT-MANN-354	comp_mannengine_s000	MECB	Blind Count	Commercial Starter Pack Item A (PRD-START-01)	Lead Auditor	45	45	0	Tallied ⚖️	2026-10-25	Routine monthly verified inventory check	2026-10-25 10:33:03.070657+05:30
21	CNT-MANN-435	comp_mannengine_s000	MECB	Cycle Count	Commercial Starter Pack Item A (PRD-START-01)	Lead Auditor	25	24	-1	Under Review	2026-10-25	Discrepancy of 1 unit in audit review	2026-10-25 10:33:03.070657+05:30
22	CNT-2025-020	comp_mann	AMD-01	Blind Count	Fire Extinguishers - ABC Dry Powder Fire Ext. 4kg	Mann Engineers Admin	47	14	-33	Variance Flagged	2026-10-25	Blind physical count on FE-ABC-4: 14 units counted vs ledger 47. Variance: -33	2026-10-25 16:51:21.866505+05:30
23	CNT-2025-021	comp_mann	AMD-01	Blind Count	Fire Extinguishers - ABC Dry Powder Fire Ext. 4kg	Mann Engineers Admin	47	14	-33	Variance Flagged	2026-10-25	Blind physical count on FE-ABC-4: 14 units counted vs ledger 47. Variance: -33	2026-10-25 16:51:22.575557+05:30
24	CNT-2025-022	comp_mann	AMD-01	Blind Count	Fire Extinguishers - ABC Dry Powder Fire Ext. 4kg	Mann Engineers Admin	47	47	0	Tallied ⚖️	2026-10-25	Blind physical count on FE-ABC-4: 47 units counted vs ledger 47. Variance: 0	2026-10-25 16:51:37.597253+05:30
25	CNT-2025-023	comp_mann	AMD-01	Blind Count	Fire Extinguishers - ABC Dry Powder Fire Ext. 4kg	Mann Engineers Admin	47	48	1	Under Review	2026-10-25	Blind physical count on FE-ABC-4: 48 units counted vs ledger 47. Variance: 1	2026-10-25 16:51:41.347013+05:30
26	CNT-2025-024	comp_mann	AMD-01	Blind Count	Fire Extinguishers - CO2 Fire Extinguisher 2kg	Mann Engineers Admin	32	15	-17	Variance Flagged	2026-10-26	Blind physical count on FE-CO2-2: 15 units counted vs ledger 32. Variance: -17	2026-10-26 15:31:04.459213+05:30
27	CNT-2025-025	comp_mann	AMD-01	Blind Count	Fire Extinguishers - CO2 Fire Extinguisher 2kg	Mann Engineers Admin	32	20	-12	Variance Flagged	2026-10-26	Blind physical count on FE-CO2-2: 20 units counted vs ledger 32. Variance: -12	2026-10-26 15:31:31.581448+05:30
28	CNT-2025-026	comp_mann	AMD-01	Blind Count	Fire Extinguishers - CO2 Fire Extinguisher 2kg	Mann Engineers Admin	32	70	38	Variance Flagged	2026-10-26	Blind physical count on FE-CO2-2: 70 units counted vs ledger 32. Variance: 38	2026-10-26 15:31:48.06099+05:30
29	CNT-2025-027	comp_mann	AMD-01	Blind Count	Fire Extinguishers - CO2 Fire Extinguisher 2kg	Mann Engineers Admin	32	32	0	Tallied ⚖️	2026-10-26	Blind physical count on FE-CO2-2: 32 units counted vs ledger 32. Variance: 0	2026-10-26 15:32:08.559855+05:30
30	CNT-2025-028	comp_mann	AMD-01	Blind Count	Aisle 3 Extinguishers	Mann Shah (Lead Auditor)	30	30	0	Tallied ⚖️	2026-10-28	Q4 Surprise Audit	2026-10-28 12:20:36.963+05:30
31	CNT-2025-029	comp_mann	AMD-01	Blind Count	Aisle 3 Extinguishers	Mann Shah (Lead Auditor)	30	30	0	Tallied ⚖️	2026-10-28	Q4 Surprise Audit	2026-10-28 12:22:44.951836+05:30
32	CNT-2025-030	comp_mann	AMD-01	Blind Count	Fire Extinguishers - ABC Dry Powder Fire Ext. 4kg	Mann Engineers Admin	47	14	-33	Variance Flagged	2026-10-28	Blind physical count on FE-ABC-4: 14 units counted vs ledger 47. Variance: -33	2026-10-28 13:31:46.887179+05:30
33	CNT-2025-031	comp_mann	AMD-01	Blind Count	Fire Extinguishers - ABC Dry Powder Fire Ext. 4kg	Mann Engineers Admin	47	14	-33	Variance Flagged	2026-10-28	Blind physical count on FE-ABC-4: 14 units counted vs ledger 47. Variance: -33	2026-10-28 13:31:56.276737+05:30
34	CNT-2025-032	comp_mann	AMD-01	Blind Count	Fire Extinguishers - ABC Dry Powder Fire Ext. 4kg	Mann Engineers Admin	47	100	53	Variance Flagged	2026-10-28	Blind physical count on FE-ABC-4: 100 units counted vs ledger 47. Variance: 53	2026-10-28 13:32:06.958281+05:30
35	CNT-2025-033	comp_mann	AMD-01	Blind Count	Fire Extinguishers - ABC Dry Powder Fire Ext. 4kg	Mann Engineers Admin	47	47	0	Tallied ⚖️	2026-10-28	Blind physical count on FE-ABC-4: 47 units counted vs ledger 47. Variance: 0	2026-10-28 13:32:13.210498+05:30
36	CNT-2025-034	comp_mann	AMD-01	Blind Count	Fire Extinguishers - ABC Dry Powder Fire Ext. 4kg	Mann Engineers Admin	47	1232	1185	Variance Flagged	2026-10-31	Blind physical count on FE-ABC-4: 1232 units counted vs ledger 47. Variance: 1185	2026-10-31 17:48:42.398882+05:30
37	CNT-2025-035	comp_mann	AMD-01	Blind Count	Fire Extinguishers - ABC Dry Powder Fire Ext. 4kg	Mann Engineers Admin	47	12	-35	Variance Flagged	2026-10-31	Blind physical count on FE-ABC-4: 12 units counted vs ledger 47. Variance: -35	2026-10-31 17:48:48.165969+05:30
38	CNT-2025-036	comp_mann	AMD-01	Blind Count	Fire Extinguishers - ABC Dry Powder Fire Ext. 4kg	Mann Engineers Admin	47	12	-35	Variance Flagged	2026-10-31	Blind physical count on FE-ABC-4: 12 units counted vs ledger 47. Variance: -35	2026-10-31 17:48:49.777014+05:30
39	CNT-2025-037	comp_mann	AMD-01	Blind Count	Fire Extinguishers - ABC Dry Powder Fire Ext. 4kg	Mann Engineers Admin	47	47	0	Tallied ⚖️	2026-10-31	Blind physical count on FE-ABC-4: 47 units counted vs ledger 47. Variance: 0	2026-10-31 17:48:54.886728+05:30
\.


--
-- TOC entry 5473 (class 0 OID 26128)
-- Dependencies: 250
-- Data for Name: financial_periods; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.financial_periods (id, company_id, fiscal_year, month_name, period_start, period_end, status, vouchers_count, locked_by, locked_at, lock_hash, notes, created_at, updated_at) FROM stdin;
1	comp_mann	2025–2026	April 2025	2025-04-01	2025-04-30	Locked	145	Tenant Owner	2025-05-01 10:00:00+05:30	\N		2026-10-24 17:40:31.382118+05:30	2026-10-24 17:40:31.382118+05:30
2	comp_mann	2025–2026	May 2025	2025-05-01	2025-05-31	Locked	132	Tenant Owner	2025-06-01 10:00:00+05:30	\N		2026-10-24 17:40:31.382118+05:30	2026-10-24 17:40:31.382118+05:30
3	comp_mann	2025–2026	June 2025	2025-06-01	2025-06-30	Locked	128	Tenant Owner	2025-07-01 10:00:00+05:30	\N		2026-10-24 17:40:31.382118+05:30	2026-10-24 17:40:31.382118+05:30
4	comp_mann	2025–2026	July 2025	2025-07-01	2025-07-31	Locked	156	Tenant Owner	2025-08-01 10:00:00+05:30	\N		2026-10-24 17:40:31.382118+05:30	2026-10-24 17:40:31.382118+05:30
5	comp_mann	2025–2026	August 2025	2025-08-01	2025-08-31	Locked	143	Tenant Owner	2025-09-01 10:00:00+05:30	\N		2026-10-24 17:40:31.382118+05:30	2026-10-24 17:40:31.382118+05:30
6	comp_mann	2025–2026	September 2025	2025-09-01	2025-09-30	Locked	139	Tenant Owner	2025-10-01 10:00:00+05:30	\N		2026-10-24 17:40:31.382118+05:30	2026-10-24 17:40:31.382118+05:30
7	comp_mann	2025–2026	October 2025	2025-10-01	2025-10-31	Open	87	—	\N	\N		2026-10-24 17:40:31.382118+05:30	2026-10-24 17:40:31.382118+05:30
8	comp_mann	2025–2026	November 2025	2025-11-01	2025-11-30	Open	0	—	\N	\N		2026-10-24 17:40:31.382118+05:30	2026-10-24 17:40:31.382118+05:30
9	comp_mann	2025–2026	December 2025	2025-12-01	2025-12-31	Open	0	—	\N	\N		2026-10-24 17:40:31.382118+05:30	2026-10-24 17:40:31.382118+05:30
10	comp_mashtech	2025–2026	April 2025	2025-04-01	2025-04-30	Locked	98	Tenant Owner	2025-05-01 10:00:00+05:30	\N		2026-10-24 17:40:31.382118+05:30	2026-10-24 17:40:31.382118+05:30
11	comp_mashtech	2025–2026	October 2025	2025-10-01	2025-10-31	Open	42	—	\N	\N		2026-10-24 17:40:31.382118+05:30	2026-10-24 17:40:31.382118+05:30
12	comp_mann	2025–2026	February 2026	2026-01-01	2026-01-31	Open	0	—	\N	\N		2026-10-24 18:40:19.989416+05:30	2026-10-24 18:40:19.989416+05:30
13	comp_apexglobal_a1sf	FY 2024-25	April 2024	2024-04-01	2024-04-30	Locked	124	Chief Auditor	\N	\N		2026-10-25 10:32:01.732091+05:30	2026-10-25 10:32:01.732091+05:30
14	comp_apexglobal_a1sf	FY 2024-25	May 2024	2024-05-01	2024-05-31	Locked	156	Chief Auditor	\N	\N		2026-10-25 10:32:01.732968+05:30	2026-10-25 10:32:01.732968+05:30
15	comp_apexglobal_a1sf	FY 2024-25	June 2024	2024-06-01	2024-06-30	Locked	182	Chief Auditor	\N	\N		2026-10-25 10:32:01.733413+05:30	2026-10-25 10:32:01.733413+05:30
16	comp_apexglobal_a1sf	FY 2024-25	October 2024	2024-10-01	2024-10-31	Open	215	—	\N	\N		2026-10-25 10:32:01.73405+05:30	2026-10-25 10:32:01.73405+05:30
17	comp_apexglobal_a1sf	FY 2024-25	November 2024	2024-11-01	2024-11-30	Open	98	—	\N	\N		2026-10-25 10:32:01.734751+05:30	2026-10-25 10:32:01.734751+05:30
18	comp_apexglobal_a1sf	FY 2024-25	December 2024	2024-12-01	2024-12-31	Open	42	—	\N	\N		2026-10-25 10:32:01.735703+05:30	2026-10-25 10:32:01.735703+05:30
19	comp_zenithindu_vk4c	FY 2024-25	April 2024	2024-04-01	2024-04-30	Locked	124	Chief Auditor	\N	\N		2026-10-25 10:33:03.011692+05:30	2026-10-25 10:33:03.011692+05:30
20	comp_zenithindu_vk4c	FY 2024-25	May 2024	2024-05-01	2024-05-31	Locked	156	Chief Auditor	\N	\N		2026-10-25 10:33:03.013356+05:30	2026-10-25 10:33:03.013356+05:30
21	comp_zenithindu_vk4c	FY 2024-25	June 2024	2024-06-01	2024-06-30	Locked	182	Chief Auditor	\N	\N		2026-10-25 10:33:03.014188+05:30	2026-10-25 10:33:03.014188+05:30
22	comp_zenithindu_vk4c	FY 2024-25	October 2024	2024-10-01	2024-10-31	Open	215	—	\N	\N		2026-10-25 10:33:03.014663+05:30	2026-10-25 10:33:03.014663+05:30
23	comp_zenithindu_vk4c	FY 2024-25	November 2024	2024-11-01	2024-11-30	Open	98	—	\N	\N		2026-10-25 10:33:03.014988+05:30	2026-10-25 10:33:03.014988+05:30
24	comp_zenithindu_vk4c	FY 2024-25	December 2024	2024-12-01	2024-12-31	Open	42	—	\N	\N		2026-10-25 10:33:03.01541+05:30	2026-10-25 10:33:03.01541+05:30
25	comp_acmetechno_cajc	FY 2024-25	April 2024	2024-04-01	2024-04-30	Locked	124	Chief Auditor	\N	\N		2026-10-25 10:33:03.029871+05:30	2026-10-25 10:33:03.029871+05:30
26	comp_acmetechno_cajc	FY 2024-25	May 2024	2024-05-01	2024-05-31	Locked	156	Chief Auditor	\N	\N		2026-10-25 10:33:03.031281+05:30	2026-10-25 10:33:03.031281+05:30
27	comp_acmetechno_cajc	FY 2024-25	June 2024	2024-06-01	2024-06-30	Locked	182	Chief Auditor	\N	\N		2026-10-25 10:33:03.032784+05:30	2026-10-25 10:33:03.032784+05:30
28	comp_acmetechno_cajc	FY 2024-25	October 2024	2024-10-01	2024-10-31	Open	215	—	\N	\N		2026-10-25 10:33:03.034322+05:30	2026-10-25 10:33:03.034322+05:30
29	comp_acmetechno_cajc	FY 2024-25	November 2024	2024-11-01	2024-11-30	Open	98	—	\N	\N		2026-10-25 10:33:03.035486+05:30	2026-10-25 10:33:03.035486+05:30
30	comp_acmetechno_cajc	FY 2024-25	December 2024	2024-12-01	2024-12-31	Open	42	—	\N	\N		2026-10-25 10:33:03.037164+05:30	2026-10-25 10:33:03.037164+05:30
31	comp_mannengine_s000	FY 2024-25	April 2024	2024-04-01	2024-04-30	Locked	124	Chief Auditor	\N	\N		2026-10-25 10:33:03.055006+05:30	2026-10-25 10:33:03.055006+05:30
32	comp_mannengine_s000	FY 2024-25	May 2024	2024-05-01	2024-05-31	Locked	156	Chief Auditor	\N	\N		2026-10-25 10:33:03.056114+05:30	2026-10-25 10:33:03.056114+05:30
33	comp_mannengine_s000	FY 2024-25	June 2024	2024-06-01	2024-06-30	Locked	182	Chief Auditor	\N	\N		2026-10-25 10:33:03.057175+05:30	2026-10-25 10:33:03.057175+05:30
36	comp_mannengine_s000	FY 2024-25	December 2024	2024-12-01	2024-12-31	Open	42	—	\N	\N		2026-10-25 10:33:03.061352+05:30	2026-10-25 10:33:03.061352+05:30
34	comp_mannengine_s000	FY 2024-25	October 2024	2024-10-01	2024-10-31	Locked	215	Mann Engineers Admin	2026-10-28 01:10:20.294791+05:30	SEC-Z78M2W76		2026-10-25 10:33:03.058306+05:30	2026-10-28 01:10:20.294791+05:30
35	comp_mannengine_s000	FY 2024-25	November 2024	2024-11-01	2024-11-30	Locked	98	Mann Engineers Admin	2026-10-28 11:50:03.851394+05:30	SEC-GG2NSCUC		2026-10-25 10:33:03.059657+05:30	2026-10-28 11:50:03.851394+05:30
37	comp_mann	2026–2027	Dec 2026 Test	2026-12-01	2026-12-31	Open	0	—	\N	\N		2026-10-28 12:20:36.887233+05:30	2026-10-28 12:20:36.903719+05:30
38	comp_mann	2026–2027	Dec 2026 Test	2026-12-01	2026-12-31	Open	0	—	\N	\N	Audit lock trial	2026-10-28 12:22:44.884106+05:30	2026-10-28 12:22:44.896312+05:30
\.


--
-- TOC entry 5449 (class 0 OID 25598)
-- Dependencies: 226
-- Data for Name: invoice_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invoice_items (id, invoice_id, invoice_no, item_code, item_name, unit, hsn_code, qty, unit_price, discount, effective_price, tax_rate, tax_amount, subtotal, remark, created_at) FROM stdin;
1	1	1	FE-ABC-4	ABC Dry Powder Fire Ext. 4kg	NOS	8424	5.00	1321.60	0.00	1321.60	18.00	1189.44	6608.00	Bay A Rack 02	2026-10-22 14:21:05.65349+05:30
2	1	1	SH-M201	Safety Helmet M-201 ISI	NOS	6506	10.00	336.30	0.00	336.30	18.00	605.34	3363.00	Yellow Industrial	2026-10-22 14:21:05.658779+05:30
3	2	2	FE-CO2-2	CO2 Fire Extinguisher 2kg	NOS	8424	2.00	2891.00	0.00	2891.00	18.00	1040.76	5782.00	CO2 Wheel Horn	2026-10-22 14:21:05.660284+05:30
4	3	3	FE-ABC-4	ABC Dry Powder Fire Ext. 4kg	NOS	8424	1.00	1321.60	0.00	1321.60	18.00	237.89	1321.60	Retail	2026-10-22 14:21:05.66212+05:30
6	5	4	FE-ABC-4	ABC Dry Powder Fire Ext. 4kg	NOS	8424	2.00	1321.60	0.00	1321.60	18.00	475.78	2643.20		2026-10-22 14:42:20.579553+05:30
10	10	5	SH-M201	Safety Helmet M-201 ISI	NOS	6506	1.00	336.30	0.00	336.30	18.00	60.53	336.30	klhn	2026-10-23 06:50:15.774175+05:30
11	10	5	FE-ABC-4	ABC Dry Powder Fire Ext. 4kg	NOS	8424	1.00	1321.60	0.00	1321.60	18.00	237.89	1321.60		2026-10-23 06:50:15.774175+05:30
14	13	6	SH-M201	Safety Helmet M-201 ISI	NOS	6506	1.00	336.30	0.00	336.30	18.00	60.53	336.30		2026-10-23 14:45:36.984083+05:30
15	13	6	SM-DET1	Smoke Detector Photoelectric	NOS	8531	1.00	1416.00	0.00	1416.00	18.00	254.88	1416.00		2026-10-23 14:45:36.984083+05:30
16	14	7	FE-CO2-2	CO2 Fire Extinguisher 2kg	NOS	8424	1.00	2891.00	50.00	2841.00	18.00	511.38	2841.00	fffff	2026-10-23 15:48:52.160387+05:30
17	15	INV-2026-1001	FE-CO2-2	CO2 Fire Extinguisher 2kg	NOS	8424	6.00	2891.00	0.00	2891.00	18.00	3122.28	17346.00		2026-10-24 09:37:39.671956+05:30
18	16	INV-2026-1002	FE-ABC-4	ABC Dry Powder Fire Ext. 4kg	NOS	8424	2.00	1321.60	0.00	1321.60	18.00	475.78	2643.20		2026-10-24 09:37:39.686593+05:30
19	16	INV-2026-1002	SRV-RCK-42	42U Server Rack Closed Smart Cooling	NOS	8537	5.00	48500.00	0.00	48500.00	18.00	43650.00	242500.00		2026-10-24 09:37:39.689503+05:30
20	17	INV-2026-1003	SP-HDR-68	Pendant Sprinkler Head 68°C Red Bulb	NOS	8424	8.00	767.00	0.00	767.00	18.00	1104.48	6136.00		2026-10-24 09:37:39.694053+05:30
21	18	INV-2026-1004	FBR-SFP-10	10G SFP+ Optical Transceiver Module 10km	NOS	8517	6.00	3650.00	0.00	3650.00	18.00	3942.00	21900.00		2026-10-24 09:37:39.697189+05:30
22	18	INV-2026-1004	SP-HDR-68	Pendant Sprinkler Head 68°C Red Bulb	NOS	8424	6.00	767.00	0.00	767.00	18.00	828.36	4602.00		2026-10-24 09:37:39.698153+05:30
23	18	INV-2026-1004	CAT6A-100M	10Gbps Shielded Cat6A Cable Roll 100m	NOS	8544	5.00	4950.00	0.00	4950.00	18.00	4455.00	24750.00		2026-10-24 09:37:39.698887+05:30
24	19	INV-2026-1005	SRV-RCK-42	42U Server Rack Closed Smart Cooling	NOS	8537	8.00	48500.00	0.00	48500.00	18.00	69840.00	388000.00		2026-10-24 09:37:39.701296+05:30
25	20	INV-2026-1006	SRV-RCK-42	42U Server Rack Closed Smart Cooling	NOS	8537	8.00	48500.00	0.00	48500.00	18.00	69840.00	388000.00		2026-10-24 09:37:39.708084+05:30
26	20	INV-2026-1006	CF-EXT-50	Chemical Foam Fire Ext. 50L Trolley	NOS	8424	3.00	9912.00	0.00	9912.00	18.00	5352.48	29736.00		2026-10-24 09:37:39.708828+05:30
27	20	INV-2026-1006	SH-M201	Safety Helmet M-201 ISI	NOS	6506	6.00	336.30	0.00	336.30	18.00	363.20	2017.80		2026-10-24 09:37:39.709732+05:30
28	21	INV-2026-1007	EX-LED-BAT	Emergency LED Exit Light 3h Backup	NOS	9405	5.00	1298.00	0.00	1298.00	18.00	1168.20	6490.00		2026-10-24 09:37:39.712285+05:30
29	22	INV-2026-1008	FR-SUT5	Fire Retardant Suit Type 5	NOS	6211	6.00	5040.00	0.00	5040.00	18.00	5443.20	30240.00		2026-10-24 09:37:39.714541+05:30
30	22	INV-2026-1008	CS-BOOT-9	Chemical Resistant Steel Toe Shoes S3	NOS	6403	1.00	2072.00	0.00	2072.00	18.00	372.96	2072.00		2026-10-24 09:37:39.715358+05:30
31	22	INV-2026-1008	FA-KIT1	First Aid Kit Industrial	NOS	3006	2.00	952.00	0.00	952.00	18.00	342.72	1904.00		2026-10-24 09:37:39.71605+05:30
32	23	INV-2026-1009	SP-HDR-68	Pendant Sprinkler Head 68°C Red Bulb	NOS	8424	1.00	767.00	0.00	767.00	18.00	138.06	767.00		2026-10-24 09:37:39.719054+05:30
33	23	INV-2026-1009	GM-FFP3	Full Face Chemical Gas Mask FFP3	NOS	9020	1.00	3363.00	0.00	3363.00	18.00	605.34	3363.00		2026-10-24 09:37:39.719677+05:30
34	24	INV-2026-1010	FBR-SFP-10	10G SFP+ Optical Transceiver Module 10km	NOS	8517	1.00	3650.00	0.00	3650.00	18.00	657.00	3650.00		2026-10-24 09:37:39.722107+05:30
35	24	INV-2026-1010	SH-M201	Safety Helmet M-201 ISI	NOS	6506	7.00	336.30	0.00	336.30	18.00	423.74	2354.10		2026-10-24 09:37:39.722722+05:30
36	24	INV-2026-1010	ESD-MAT-01	Anti-Static ESD Grounding Mat 2x1m	NOS	3926	7.00	2450.00	0.00	2450.00	18.00	3087.00	17150.00		2026-10-24 09:37:39.72348+05:30
37	25	INV-2026-1011	FA-KIT1	First Aid Kit Industrial	NOS	3006	3.00	952.00	0.00	952.00	18.00	514.08	2856.00		2026-10-24 09:37:39.726727+05:30
38	25	INV-2026-1011	SRV-RCK-42	42U Server Rack Closed Smart Cooling	NOS	8537	1.00	48500.00	0.00	48500.00	18.00	8730.00	48500.00		2026-10-24 09:37:39.727374+05:30
39	26	INV-2026-1012	FW-GW-10G	10Gbps Enterprise Next-Gen Firewall Gateway	NOS	8517	7.00	94500.00	0.00	94500.00	18.00	119070.00	661500.00		2026-10-24 09:37:39.730156+05:30
40	26	INV-2026-1012	LSR-SFT-GLS	Optical Fiber Laser Safety Protective Goggles	NOS	9004	2.00	5800.00	0.00	5800.00	18.00	2088.00	11600.00		2026-10-24 09:37:39.730758+05:30
41	27	INV-2026-1013	HAZ-TYP3	Tychem 6000 Hazmat Liquid Suit	NOS	6210	3.00	7168.00	0.00	7168.00	18.00	3870.72	21504.00		2026-10-24 09:37:39.73273+05:30
42	27	INV-2026-1013	SP-HDR-68	Pendant Sprinkler Head 68°C Red Bulb	NOS	8424	3.00	767.00	0.00	767.00	18.00	414.18	2301.00		2026-10-24 09:37:39.733892+05:30
43	28	INV-2026-1014	GM-FFP3	Full Face Chemical Gas Mask FFP3	NOS	9020	1.00	3363.00	0.00	3363.00	18.00	605.34	3363.00		2026-10-24 09:37:39.736068+05:30
44	28	INV-2026-1014	FW-GW-10G	10Gbps Enterprise Next-Gen Firewall Gateway	NOS	8517	3.00	94500.00	0.00	94500.00	18.00	51030.00	283500.00		2026-10-24 09:37:39.736633+05:30
45	29	INV-2026-1015	HAZ-TYP3	Tychem 6000 Hazmat Liquid Suit	NOS	6210	8.00	7168.00	0.00	7168.00	18.00	10321.92	57344.00		2026-10-24 09:37:39.739699+05:30
46	30	INV-2026-1016	HR-SWV-30	Swinging Hose Reel Drum 30m with Nozzle	NOS	8424	8.00	7316.00	0.00	7316.00	18.00	10535.04	58528.00		2026-10-24 09:37:39.742515+05:30
47	30	INV-2026-1016	RACK-PDU-16	Smart Metered Rack PDU 16A 230V 24 Outlets	NOS	8537	3.00	18500.00	0.00	18500.00	18.00	9990.00	55500.00		2026-10-24 09:37:39.743152+05:30
48	31	INV-2026-1017	HAZ-TYP3	Tychem 6000 Hazmat Liquid Suit	NOS	6210	4.00	7168.00	0.00	7168.00	18.00	5160.96	28672.00		2026-10-24 09:37:39.747346+05:30
49	31	INV-2026-1017	FW-GW-10G	10Gbps Enterprise Next-Gen Firewall Gateway	NOS	8517	6.00	94500.00	0.00	94500.00	18.00	102060.00	567000.00		2026-10-24 09:37:39.748129+05:30
50	31	INV-2026-1017	SRV-RCK-42	42U Server Rack Closed Smart Cooling	NOS	8537	6.00	48500.00	0.00	48500.00	18.00	52380.00	291000.00		2026-10-24 09:37:39.749927+05:30
51	32	INV-2026-1018	SG-CL01	Safety Goggles Clear Lens	NOS	9004	4.00	171.10	0.00	171.10	18.00	123.19	684.40		2026-10-24 09:37:39.752386+05:30
52	32	INV-2026-1018	SP-HDR-68	Pendant Sprinkler Head 68°C Red Bulb	NOS	8424	6.00	767.00	0.00	767.00	18.00	828.36	4602.00		2026-10-24 09:37:39.753116+05:30
53	33	INV-2026-1019	EX-LED-BAT	Emergency LED Exit Light 3h Backup	NOS	9405	2.00	1298.00	0.00	1298.00	18.00	467.28	2596.00		2026-10-24 09:37:39.75588+05:30
54	34	INV-2026-1020	HT-GLV-500	500°C Heat Resistant Aluminized Gloves	NOS	6116	3.00	1848.00	0.00	1848.00	18.00	997.92	5544.00		2026-10-24 09:37:39.758292+05:30
55	34	INV-2026-1020	ESD-MAT-01	Anti-Static ESD Grounding Mat 2x1m	NOS	3926	5.00	2450.00	0.00	2450.00	18.00	2205.00	12250.00		2026-10-24 09:37:39.759025+05:30
56	34	INV-2026-1020	SH-M201	Safety Helmet M-201 ISI	NOS	6506	7.00	336.30	0.00	336.30	18.00	423.74	2354.10		2026-10-24 09:37:39.759684+05:30
57	35	INV-2026-1021	HAZ-TYP3	Tychem 6000 Hazmat Liquid Suit	NOS	6210	4.00	7168.00	0.00	7168.00	18.00	5160.96	28672.00		2026-10-24 09:37:39.763402+05:30
58	35	INV-2026-1021	FBR-SFP-10	10G SFP+ Optical Transceiver Module 10km	NOS	8517	6.00	3650.00	0.00	3650.00	18.00	3942.00	21900.00		2026-10-24 09:37:39.76402+05:30
59	36	INV-2026-1022	FB-HVY-2	Heavy Duty Fire Blanket 2x2m Fiberglass	NOS	7019	1.00	1475.00	0.00	1475.00	18.00	265.50	1475.00		2026-10-24 09:37:39.766137+05:30
60	36	INV-2026-1022	LSR-SFT-GLS	Optical Fiber Laser Safety Protective Goggles	NOS	9004	4.00	5800.00	0.00	5800.00	18.00	4176.00	23200.00		2026-10-24 09:37:39.767015+05:30
61	36	INV-2026-1022	CAT6A-100M	10Gbps Shielded Cat6A Cable Roll 100m	NOS	8544	7.00	4950.00	0.00	4950.00	18.00	6237.00	34650.00		2026-10-24 09:37:39.76776+05:30
62	37	INV-2026-1023	HT-GLV-500	500°C Heat Resistant Aluminized Gloves	NOS	6116	3.00	1848.00	0.00	1848.00	18.00	997.92	5544.00		2026-10-24 09:37:39.77115+05:30
63	37	INV-2026-1023	LSR-SFT-GLS	Optical Fiber Laser Safety Protective Goggles	NOS	9004	2.00	5800.00	0.00	5800.00	18.00	2088.00	11600.00		2026-10-24 09:37:39.77228+05:30
64	37	INV-2026-1023	EX-LED-BAT	Emergency LED Exit Light 3h Backup	NOS	9405	7.00	1298.00	0.00	1298.00	18.00	1635.48	9086.00		2026-10-24 09:37:39.772956+05:30
65	38	INV-2026-1024	SRV-RCK-42	42U Server Rack Closed Smart Cooling	NOS	8537	6.00	48500.00	0.00	48500.00	18.00	52380.00	291000.00		2026-10-24 09:37:39.775421+05:30
66	38	INV-2026-1024	LSR-SFT-GLS	Optical Fiber Laser Safety Protective Goggles	NOS	9004	1.00	5800.00	0.00	5800.00	18.00	1044.00	5800.00		2026-10-24 09:37:39.775978+05:30
67	39	INV-2026-1025	UPS-3KVA-ON	3kVA Online UPS Pure Sine Wave 230V	NOS	8504	5.00	38200.00	0.00	38200.00	18.00	34380.00	191000.00		2026-10-24 09:37:39.778019+05:30
68	39	INV-2026-1025	HT-GLV-500	500°C Heat Resistant Aluminized Gloves	NOS	6116	5.00	1848.00	0.00	1848.00	18.00	1663.20	9240.00		2026-10-24 09:37:39.778658+05:30
69	39	INV-2026-1025	HR-SWV-30	Swinging Hose Reel Drum 30m with Nozzle	NOS	8424	4.00	7316.00	0.00	7316.00	18.00	5267.52	29264.00		2026-10-24 09:37:39.779459+05:30
70	40	INV-2026-1026	HT-GLV-500	500°C Heat Resistant Aluminized Gloves	NOS	6116	5.00	1848.00	0.00	1848.00	18.00	1663.20	9240.00		2026-10-24 09:37:39.781993+05:30
71	40	INV-2026-1026	HR-SWV-30	Swinging Hose Reel Drum 30m with Nozzle	NOS	8424	4.00	7316.00	0.00	7316.00	18.00	5267.52	29264.00		2026-10-24 09:37:39.782571+05:30
72	40	INV-2026-1026	FW-GW-10G	10Gbps Enterprise Next-Gen Firewall Gateway	NOS	8517	6.00	94500.00	0.00	94500.00	18.00	102060.00	567000.00		2026-10-24 09:37:39.78328+05:30
73	41	INV-2026-1027	SRV-RCK-42	42U Server Rack Closed Smart Cooling	NOS	8537	8.00	48500.00	0.00	48500.00	18.00	69840.00	388000.00		2026-10-24 09:37:39.78616+05:30
74	41	INV-2026-1027	SH-M201	Safety Helmet M-201 ISI	NOS	6506	3.00	336.30	0.00	336.30	18.00	181.60	1008.90		2026-10-24 09:37:39.786903+05:30
75	42	INV-2026-1028	UPS-3KVA-ON	3kVA Online UPS Pure Sine Wave 230V	NOS	8504	3.00	38200.00	0.00	38200.00	18.00	20628.00	114600.00		2026-10-24 09:37:39.788951+05:30
76	42	INV-2026-1028	UPS-3KVA-ON	3kVA Online UPS Pure Sine Wave 230V	NOS	8504	8.00	38200.00	0.00	38200.00	18.00	55008.00	305600.00		2026-10-24 09:37:39.789635+05:30
77	42	INV-2026-1028	HT-GLV-500	500°C Heat Resistant Aluminized Gloves	NOS	6116	7.00	1848.00	0.00	1848.00	18.00	2328.48	12936.00		2026-10-24 09:37:39.790241+05:30
78	43	INV-2026-1029	FE-CO2-2	CO2 Fire Extinguisher 2kg	NOS	8424	8.00	2891.00	0.00	2891.00	18.00	4163.04	23128.00		2026-10-24 09:37:39.792566+05:30
79	43	INV-2026-1029	FW-GW-10G	10Gbps Enterprise Next-Gen Firewall Gateway	NOS	8517	8.00	94500.00	0.00	94500.00	18.00	136080.00	756000.00		2026-10-24 09:37:39.793462+05:30
80	43	INV-2026-1029	RACK-PDU-16	Smart Metered Rack PDU 16A 230V 24 Outlets	NOS	8537	5.00	18500.00	0.00	18500.00	18.00	16650.00	92500.00		2026-10-24 09:37:39.79415+05:30
81	44	INV-2026-1030	FW-GW-10G	10Gbps Enterprise Next-Gen Firewall Gateway	NOS	8517	1.00	94500.00	0.00	94500.00	18.00	17010.00	94500.00		2026-10-24 09:37:39.796687+05:30
82	44	INV-2026-1030	GM-FFP3	Full Face Chemical Gas Mask FFP3	NOS	9020	2.00	3363.00	0.00	3363.00	18.00	1210.68	6726.00		2026-10-24 09:37:39.797327+05:30
83	45	INV-2026-1031	FBR-SFP-10	10G SFP+ Optical Transceiver Module 10km	NOS	8517	2.00	3650.00	0.00	3650.00	18.00	1314.00	7300.00		2026-10-24 09:37:39.79987+05:30
84	45	INV-2026-1031	HT-GLV-500	500°C Heat Resistant Aluminized Gloves	NOS	6116	2.00	1848.00	0.00	1848.00	18.00	665.28	3696.00		2026-10-24 09:37:39.800383+05:30
85	45	INV-2026-1031	SP-HDR-68	Pendant Sprinkler Head 68°C Red Bulb	NOS	8424	7.00	767.00	0.00	767.00	18.00	966.42	5369.00		2026-10-24 09:37:39.801196+05:30
86	46	INV-2026-1032	CAT6A-100M	10Gbps Shielded Cat6A Cable Roll 100m	NOS	8544	5.00	4950.00	0.00	4950.00	18.00	4455.00	24750.00		2026-10-24 09:37:39.803283+05:30
87	46	INV-2026-1032	RACK-PDU-16	Smart Metered Rack PDU 16A 230V 24 Outlets	NOS	8537	4.00	18500.00	0.00	18500.00	18.00	13320.00	74000.00		2026-10-24 09:37:39.804094+05:30
88	46	INV-2026-1032	EX-LED-BAT	Emergency LED Exit Light 3h Backup	NOS	9405	3.00	1298.00	0.00	1298.00	18.00	700.92	3894.00		2026-10-24 09:37:39.804875+05:30
89	47	INV-2026-1033	SH-M201	Safety Helmet M-201 ISI	NOS	6506	7.00	336.30	0.00	336.30	18.00	423.74	2354.10		2026-10-24 09:37:39.807578+05:30
90	47	INV-2026-1033	RACK-PDU-16	Smart Metered Rack PDU 16A 230V 24 Outlets	NOS	8537	8.00	18500.00	0.00	18500.00	18.00	26640.00	148000.00		2026-10-24 09:37:39.808446+05:30
91	47	INV-2026-1033	LSR-SFT-GLS	Optical Fiber Laser Safety Protective Goggles	NOS	9004	4.00	5800.00	0.00	5800.00	18.00	4176.00	23200.00		2026-10-24 09:37:39.809171+05:30
92	48	INV-2026-1034	SRV-RCK-42	42U Server Rack Closed Smart Cooling	NOS	8537	2.00	48500.00	0.00	48500.00	18.00	17460.00	97000.00		2026-10-24 09:37:39.810912+05:30
93	48	INV-2026-1034	SH-M201	Safety Helmet M-201 ISI	NOS	6506	5.00	336.30	0.00	336.30	18.00	302.67	1681.50		2026-10-24 09:37:39.811464+05:30
94	48	INV-2026-1034	SRV-RCK-42	42U Server Rack Closed Smart Cooling	NOS	8537	7.00	48500.00	0.00	48500.00	18.00	61110.00	339500.00		2026-10-24 09:37:39.811971+05:30
95	49	INV-2026-1035	HR-SWV-30	Swinging Hose Reel Drum 30m with Nozzle	NOS	8424	4.00	7316.00	0.00	7316.00	18.00	5267.52	29264.00		2026-10-24 09:37:39.813903+05:30
96	49	INV-2026-1035	FB-HVY-2	Heavy Duty Fire Blanket 2x2m Fiberglass	NOS	7019	4.00	1475.00	0.00	1475.00	18.00	1062.00	5900.00		2026-10-24 09:37:39.814391+05:30
97	49	INV-2026-1035	CAT6A-100M	10Gbps Shielded Cat6A Cable Roll 100m	NOS	8544	8.00	4950.00	0.00	4950.00	18.00	7128.00	39600.00		2026-10-24 09:37:39.814904+05:30
98	50	INV-2026-1036	HT-GLV-500	500°C Heat Resistant Aluminized Gloves	NOS	6116	2.00	1848.00	0.00	1848.00	18.00	665.28	3696.00		2026-10-24 09:37:39.818294+05:30
99	51	INV-2026-1037	HAZ-TYP3	Tychem 6000 Hazmat Liquid Suit	NOS	6210	8.00	7168.00	0.00	7168.00	18.00	10321.92	57344.00		2026-10-24 09:37:39.820253+05:30
100	51	INV-2026-1037	HAZ-TYP3	Tychem 6000 Hazmat Liquid Suit	NOS	6210	5.00	7168.00	0.00	7168.00	18.00	6451.20	35840.00		2026-10-24 09:37:39.820995+05:30
101	51	INV-2026-1037	UPS-3KVA-ON	3kVA Online UPS Pure Sine Wave 230V	NOS	8504	2.00	38200.00	0.00	38200.00	18.00	13752.00	76400.00		2026-10-24 09:37:39.821666+05:30
102	52	INV-2026-1038	EX-LED-BAT	Emergency LED Exit Light 3h Backup	NOS	9405	1.00	1298.00	0.00	1298.00	18.00	233.64	1298.00		2026-10-24 09:37:39.82379+05:30
103	52	INV-2026-1038	HR-SWV-30	Swinging Hose Reel Drum 30m with Nozzle	NOS	8424	6.00	7316.00	0.00	7316.00	18.00	7901.28	43896.00		2026-10-24 09:37:39.824284+05:30
104	53	INV-2026-1039	HR-SWV-30	Swinging Hose Reel Drum 30m with Nozzle	NOS	8424	2.00	7316.00	0.00	7316.00	18.00	2633.76	14632.00		2026-10-24 09:37:39.82659+05:30
105	53	INV-2026-1039	CF-EXT-50	Chemical Foam Fire Ext. 50L Trolley	NOS	8424	2.00	9912.00	0.00	9912.00	18.00	3568.32	19824.00		2026-10-24 09:37:39.8274+05:30
106	53	INV-2026-1039	LSR-SFT-GLS	Optical Fiber Laser Safety Protective Goggles	NOS	9004	8.00	5800.00	0.00	5800.00	18.00	8352.00	46400.00		2026-10-24 09:37:39.827931+05:30
107	54	INV-2026-1040	HR-SWV-30	Swinging Hose Reel Drum 30m with Nozzle	NOS	8424	7.00	7316.00	0.00	7316.00	18.00	9218.16	51212.00		2026-10-24 09:37:39.829809+05:30
108	54	INV-2026-1040	FW-GW-10G	10Gbps Enterprise Next-Gen Firewall Gateway	NOS	8517	5.00	94500.00	0.00	94500.00	18.00	85050.00	472500.00		2026-10-24 09:37:39.830385+05:30
109	54	INV-2026-1040	GM-FFP3	Full Face Chemical Gas Mask FFP3	NOS	9020	7.00	3363.00	0.00	3363.00	18.00	4237.38	23541.00		2026-10-24 09:37:39.831035+05:30
110	55	INV-2026-1041	FE-CO2-2	CO2 Fire Extinguisher 2kg	NOS	8424	2.00	2891.00	0.00	2891.00	18.00	1040.76	5782.00		2026-10-24 09:37:39.833412+05:30
111	56	INV-2026-1042	HT-GLV-500	500°C Heat Resistant Aluminized Gloves	NOS	6116	2.00	1848.00	0.00	1848.00	18.00	665.28	3696.00		2026-10-24 09:37:39.837343+05:30
112	56	INV-2026-1042	FBR-SFP-10	10G SFP+ Optical Transceiver Module 10km	NOS	8517	5.00	3650.00	0.00	3650.00	18.00	3285.00	18250.00		2026-10-24 09:37:39.837824+05:30
113	56	INV-2026-1042	GM-FFP3	Full Face Chemical Gas Mask FFP3	NOS	9020	1.00	3363.00	0.00	3363.00	18.00	605.34	3363.00		2026-10-24 09:37:39.838437+05:30
114	57	INV-2026-1043	GM-FFP3	Full Face Chemical Gas Mask FFP3	NOS	9020	5.00	3363.00	0.00	3363.00	18.00	3026.70	16815.00		2026-10-24 09:37:39.840459+05:30
115	57	INV-2026-1043	SP-HDR-68	Pendant Sprinkler Head 68°C Red Bulb	NOS	8424	4.00	767.00	0.00	767.00	18.00	552.24	3068.00		2026-10-24 09:37:39.841381+05:30
116	58	INV-2026-1044	CAT6A-100M	10Gbps Shielded Cat6A Cable Roll 100m	NOS	8544	6.00	4950.00	0.00	4950.00	18.00	5346.00	29700.00		2026-10-24 09:37:39.844+05:30
117	58	INV-2026-1044	SP-HDR-68	Pendant Sprinkler Head 68°C Red Bulb	NOS	8424	1.00	767.00	0.00	767.00	18.00	138.06	767.00		2026-10-24 09:37:39.844776+05:30
118	59	INV-2026-1045	FBR-SFP-10	10G SFP+ Optical Transceiver Module 10km	NOS	8517	2.00	3650.00	0.00	3650.00	18.00	1314.00	7300.00		2026-10-24 09:37:39.848494+05:30
119	59	INV-2026-1045	FR-SUT5	Fire Retardant Suit Type 5	NOS	6211	6.00	5040.00	0.00	5040.00	18.00	5443.20	30240.00		2026-10-24 09:37:39.84929+05:30
120	60	INV-2026-1046	SP-HDR-68	Pendant Sprinkler Head 68°C Red Bulb	NOS	8424	5.00	767.00	0.00	767.00	18.00	690.30	3835.00		2026-10-24 09:37:39.852889+05:30
121	60	INV-2026-1046	RACK-PDU-16	Smart Metered Rack PDU 16A 230V 24 Outlets	NOS	8537	5.00	18500.00	0.00	18500.00	18.00	16650.00	92500.00		2026-10-24 09:37:39.853727+05:30
122	60	INV-2026-1046	SG-CL01	Safety Goggles Clear Lens	NOS	9004	6.00	171.10	0.00	171.10	18.00	184.79	1026.60		2026-10-24 09:37:39.854548+05:30
123	61	INV-2026-1047	HT-GLV-500	500°C Heat Resistant Aluminized Gloves	NOS	6116	1.00	1848.00	0.00	1848.00	18.00	332.64	1848.00		2026-10-24 09:37:39.857507+05:30
124	62	INV-2026-1048	SG-CL01	Safety Goggles Clear Lens	NOS	9004	5.00	171.10	0.00	171.10	18.00	153.99	855.50		2026-10-24 09:37:39.861377+05:30
125	63	INV-2026-1049	CS-BOOT-9	Chemical Resistant Steel Toe Shoes S3	NOS	6403	2.00	2072.00	0.00	2072.00	18.00	745.92	4144.00		2026-10-24 09:37:39.865603+05:30
126	63	INV-2026-1049	CF-EXT-50	Chemical Foam Fire Ext. 50L Trolley	NOS	8424	7.00	9912.00	0.00	9912.00	18.00	12489.12	69384.00		2026-10-24 09:37:39.866474+05:30
127	63	INV-2026-1049	UPS-3KVA-ON	3kVA Online UPS Pure Sine Wave 230V	NOS	8504	8.00	38200.00	0.00	38200.00	18.00	55008.00	305600.00		2026-10-24 09:37:39.867278+05:30
128	64	INV-2026-1050	CS-BOOT-9	Chemical Resistant Steel Toe Shoes S3	NOS	6403	4.00	2072.00	0.00	2072.00	18.00	1491.84	8288.00		2026-10-24 09:37:39.870955+05:30
129	64	INV-2026-1050	SP-HDR-68	Pendant Sprinkler Head 68°C Red Bulb	NOS	8424	1.00	767.00	0.00	767.00	18.00	138.06	767.00		2026-10-24 09:37:39.871821+05:30
130	65	INV-2026-1051	SH-M201	Safety Helmet M-201 ISI	NOS	6506	2.00	336.30	0.00	336.30	18.00	121.07	672.60		2026-10-24 09:37:39.876274+05:30
131	66	INV-2026-1052	FE-CO2-2	CO2 Fire Extinguisher 2kg	NOS	8424	2.00	2891.00	0.00	2891.00	18.00	1040.76	5782.00		2026-10-24 09:37:39.879187+05:30
132	66	INV-2026-1052	FBR-SFP-10	10G SFP+ Optical Transceiver Module 10km	NOS	8517	2.00	3650.00	0.00	3650.00	18.00	1314.00	7300.00		2026-10-24 09:37:39.880159+05:30
133	67	INV-2026-1053	FB-HVY-2	Heavy Duty Fire Blanket 2x2m Fiberglass	NOS	7019	2.00	1475.00	0.00	1475.00	18.00	531.00	2950.00		2026-10-24 09:37:39.882006+05:30
134	68	INV-2026-1054	HR-SWV-30	Swinging Hose Reel Drum 30m with Nozzle	NOS	8424	5.00	7316.00	0.00	7316.00	18.00	6584.40	36580.00		2026-10-24 09:37:39.885891+05:30
135	68	INV-2026-1054	FW-GW-10G	10Gbps Enterprise Next-Gen Firewall Gateway	NOS	8517	8.00	94500.00	0.00	94500.00	18.00	136080.00	756000.00		2026-10-24 09:37:39.887041+05:30
136	68	INV-2026-1054	HR-SWV-30	Swinging Hose Reel Drum 30m with Nozzle	NOS	8424	5.00	7316.00	0.00	7316.00	18.00	6584.40	36580.00		2026-10-24 09:37:39.887791+05:30
137	69	INV-2026-1055	SRV-RCK-42	42U Server Rack Closed Smart Cooling	NOS	8537	5.00	48500.00	0.00	48500.00	18.00	43650.00	242500.00		2026-10-24 09:37:39.889494+05:30
138	69	INV-2026-1055	RACK-PDU-16	Smart Metered Rack PDU 16A 230V 24 Outlets	NOS	8537	7.00	18500.00	0.00	18500.00	18.00	23310.00	129500.00		2026-10-24 09:37:39.890116+05:30
139	70	INV-2026-1056	FA-KIT1	First Aid Kit Industrial	NOS	3006	4.00	952.00	0.00	952.00	18.00	685.44	3808.00		2026-10-24 09:37:39.892095+05:30
140	71	INV-2026-1057	UPS-3KVA-ON	3kVA Online UPS Pure Sine Wave 230V	NOS	8504	3.00	38200.00	0.00	38200.00	18.00	20628.00	114600.00		2026-10-24 09:37:39.893758+05:30
141	72	INV-2026-1058	FE-ABC-4	ABC Dry Powder Fire Ext. 4kg	NOS	8424	8.00	1321.60	0.00	1321.60	18.00	1903.10	10572.80		2026-10-24 09:37:39.894847+05:30
142	72	INV-2026-1058	SP-HDR-68	Pendant Sprinkler Head 68°C Red Bulb	NOS	8424	8.00	767.00	0.00	767.00	18.00	1104.48	6136.00		2026-10-24 09:37:39.895224+05:30
143	73	INV-2026-1059	UPS-3KVA-ON	3kVA Online UPS Pure Sine Wave 230V	NOS	8504	7.00	38200.00	0.00	38200.00	18.00	48132.00	267400.00		2026-10-24 09:37:39.897107+05:30
144	73	INV-2026-1059	HR-SWV-30	Swinging Hose Reel Drum 30m with Nozzle	NOS	8424	3.00	7316.00	0.00	7316.00	18.00	3950.64	21948.00		2026-10-24 09:37:39.897718+05:30
145	74	INV-2026-1060	HR-SWV-30	Swinging Hose Reel Drum 30m with Nozzle	NOS	8424	5.00	7316.00	0.00	7316.00	18.00	6584.40	36580.00		2026-10-24 09:37:39.899781+05:30
146	75	INV-2026-1061	LSR-SFT-GLS	Optical Fiber Laser Safety Protective Goggles	NOS	9004	3.00	5800.00	0.00	5800.00	18.00	3132.00	17400.00		2026-10-24 09:37:39.901605+05:30
147	76	INV-2026-1062	SP-HDR-68	Pendant Sprinkler Head 68°C Red Bulb	NOS	8424	1.00	767.00	0.00	767.00	18.00	138.06	767.00		2026-10-24 09:37:39.902939+05:30
148	77	INV-2026-1063	FA-KIT1	First Aid Kit Industrial	NOS	3006	5.00	952.00	0.00	952.00	18.00	856.80	4760.00		2026-10-24 09:37:39.905016+05:30
149	77	INV-2026-1063	GM-FFP3	Full Face Chemical Gas Mask FFP3	NOS	9020	4.00	3363.00	0.00	3363.00	18.00	2421.36	13452.00		2026-10-24 09:37:39.905477+05:30
150	78	INV-2026-1064	SP-HDR-68	Pendant Sprinkler Head 68°C Red Bulb	NOS	8424	3.00	767.00	0.00	767.00	18.00	414.18	2301.00		2026-10-24 09:37:39.906752+05:30
151	78	INV-2026-1064	SP-HDR-68	Pendant Sprinkler Head 68°C Red Bulb	NOS	8424	2.00	767.00	0.00	767.00	18.00	276.12	1534.00		2026-10-24 09:37:39.907169+05:30
152	79	INV-2026-1065	LSR-SFT-GLS	Optical Fiber Laser Safety Protective Goggles	NOS	9004	6.00	5800.00	0.00	5800.00	18.00	6264.00	34800.00		2026-10-24 09:37:39.908931+05:30
153	79	INV-2026-1065	HR-SWV-30	Swinging Hose Reel Drum 30m with Nozzle	NOS	8424	5.00	7316.00	0.00	7316.00	18.00	6584.40	36580.00		2026-10-24 09:37:39.909763+05:30
154	80	INV-2026-1066	HR-SWV-30	Swinging Hose Reel Drum 30m with Nozzle	NOS	8424	1.00	7316.00	0.00	7316.00	18.00	1316.88	7316.00		2026-10-24 09:37:39.912171+05:30
155	80	INV-2026-1066	SP-HDR-68	Pendant Sprinkler Head 68°C Red Bulb	NOS	8424	2.00	767.00	0.00	767.00	18.00	276.12	1534.00		2026-10-24 09:37:39.912686+05:30
156	80	INV-2026-1066	HT-GLV-500	500°C Heat Resistant Aluminized Gloves	NOS	6116	2.00	1848.00	0.00	1848.00	18.00	665.28	3696.00		2026-10-24 09:37:39.913268+05:30
157	81	INV-2026-1067	CF-EXT-50	Chemical Foam Fire Ext. 50L Trolley	NOS	8424	2.00	9912.00	0.00	9912.00	18.00	3568.32	19824.00		2026-10-24 09:37:39.914891+05:30
158	82	INV-2026-1068	HR-SWV-30	Swinging Hose Reel Drum 30m with Nozzle	NOS	8424	4.00	7316.00	0.00	7316.00	18.00	5267.52	29264.00		2026-10-24 09:37:39.916608+05:30
159	82	INV-2026-1068	HR-SWV-30	Swinging Hose Reel Drum 30m with Nozzle	NOS	8424	6.00	7316.00	0.00	7316.00	18.00	7901.28	43896.00		2026-10-24 09:37:39.917444+05:30
160	82	INV-2026-1068	SM-DET1	Smoke Detector Photoelectric	NOS	8531	3.00	1416.00	0.00	1416.00	18.00	764.64	4248.00		2026-10-24 09:37:39.918367+05:30
161	83	INV-2026-1069	FR-SUT5	Fire Retardant Suit Type 5	NOS	6211	4.00	5040.00	0.00	5040.00	18.00	3628.80	20160.00		2026-10-24 09:37:39.92132+05:30
162	83	INV-2026-1069	SP-HDR-68	Pendant Sprinkler Head 68°C Red Bulb	NOS	8424	6.00	767.00	0.00	767.00	18.00	828.36	4602.00		2026-10-24 09:37:39.921842+05:30
163	84	INV-2026-1070	CF-EXT-50	Chemical Foam Fire Ext. 50L Trolley	NOS	8424	6.00	9912.00	0.00	9912.00	18.00	10704.96	59472.00		2026-10-24 09:37:39.923774+05:30
164	84	INV-2026-1070	UPS-3KVA-ON	3kVA Online UPS Pure Sine Wave 230V	NOS	8504	5.00	38200.00	0.00	38200.00	18.00	34380.00	191000.00		2026-10-24 09:37:39.924639+05:30
165	85	INV-2026-1071	SH-M201	Safety Helmet M-201 ISI	NOS	6506	3.00	336.30	0.00	336.30	18.00	181.60	1008.90		2026-10-24 09:37:39.927876+05:30
166	85	INV-2026-1071	LSR-SFT-GLS	Optical Fiber Laser Safety Protective Goggles	NOS	9004	2.00	5800.00	0.00	5800.00	18.00	2088.00	11600.00		2026-10-24 09:37:39.928708+05:30
167	86	INV-2026-1072	FE-ABC-4	ABC Dry Powder Fire Ext. 4kg	NOS	8424	3.00	1321.60	0.00	1321.60	18.00	713.66	3964.80		2026-10-24 09:37:39.932365+05:30
168	87	INV-2026-1073	FR-SUT5	Fire Retardant Suit Type 5	NOS	6211	8.00	5040.00	0.00	5040.00	18.00	7257.60	40320.00		2026-10-24 09:37:39.935234+05:30
169	87	INV-2026-1073	HR-SWV-30	Swinging Hose Reel Drum 30m with Nozzle	NOS	8424	7.00	7316.00	0.00	7316.00	18.00	9218.16	51212.00		2026-10-24 09:37:39.936045+05:30
170	87	INV-2026-1073	SP-HDR-68	Pendant Sprinkler Head 68°C Red Bulb	NOS	8424	4.00	767.00	0.00	767.00	18.00	552.24	3068.00		2026-10-24 09:37:39.936859+05:30
171	88	INV-2026-1074	CAT6A-100M	10Gbps Shielded Cat6A Cable Roll 100m	NOS	8544	3.00	4950.00	0.00	4950.00	18.00	2673.00	14850.00		2026-10-24 09:37:39.939627+05:30
172	88	INV-2026-1074	RACK-PDU-16	Smart Metered Rack PDU 16A 230V 24 Outlets	NOS	8537	5.00	18500.00	0.00	18500.00	18.00	16650.00	92500.00		2026-10-24 09:37:39.940431+05:30
173	89	INV-2026-1075	HT-GLV-500	500°C Heat Resistant Aluminized Gloves	NOS	6116	3.00	1848.00	0.00	1848.00	18.00	997.92	5544.00		2026-10-24 09:37:39.943832+05:30
174	89	INV-2026-1075	LSR-SFT-GLS	Optical Fiber Laser Safety Protective Goggles	NOS	9004	3.00	5800.00	0.00	5800.00	18.00	3132.00	17400.00		2026-10-24 09:37:39.944582+05:30
175	89	INV-2026-1075	EX-LED-BAT	Emergency LED Exit Light 3h Backup	NOS	9405	6.00	1298.00	0.00	1298.00	18.00	1401.84	7788.00		2026-10-24 09:37:39.945381+05:30
176	90	INV-2026-1076	FE-CO2-2	CO2 Fire Extinguisher 2kg	NOS	8424	5.00	2891.00	0.00	2891.00	18.00	2601.90	14455.00		2026-10-24 09:37:39.948982+05:30
177	90	INV-2026-1076	HT-GLV-500	500°C Heat Resistant Aluminized Gloves	NOS	6116	3.00	1848.00	0.00	1848.00	18.00	997.92	5544.00		2026-10-24 09:37:39.949781+05:30
178	90	INV-2026-1076	HT-GLV-500	500°C Heat Resistant Aluminized Gloves	NOS	6116	7.00	1848.00	0.00	1848.00	18.00	2328.48	12936.00		2026-10-24 09:37:39.950499+05:30
179	91	INV-2026-1077	FR-SUT5	Fire Retardant Suit Type 5	NOS	6211	7.00	5040.00	0.00	5040.00	18.00	6350.40	35280.00		2026-10-24 09:37:39.952834+05:30
180	92	INV-2026-1078	FR-SUT5	Fire Retardant Suit Type 5	NOS	6211	7.00	5040.00	0.00	5040.00	18.00	6350.40	35280.00		2026-10-24 09:37:39.956176+05:30
181	92	INV-2026-1078	SP-HDR-68	Pendant Sprinkler Head 68°C Red Bulb	NOS	8424	2.00	767.00	0.00	767.00	18.00	276.12	1534.00		2026-10-24 09:37:39.95677+05:30
182	93	INV-2026-1079	RACK-PDU-16	Smart Metered Rack PDU 16A 230V 24 Outlets	NOS	8537	3.00	18500.00	0.00	18500.00	18.00	9990.00	55500.00		2026-10-24 09:37:39.958236+05:30
183	94	INV-2026-1080	FE-CO2-2	CO2 Fire Extinguisher 2kg	NOS	8424	8.00	2891.00	0.00	2891.00	18.00	4163.04	23128.00		2026-10-24 09:37:39.960574+05:30
184	95	INV-2026-1081	FE-ABC-4	ABC Dry Powder Fire Ext. 4kg	NOS	8424	3.00	1321.60	0.00	1321.60	18.00	713.66	3964.80		2026-10-24 09:37:39.963873+05:30
185	96	INV-2026-1082	EX-LED-BAT	Emergency LED Exit Light 3h Backup	NOS	9405	8.00	1298.00	0.00	1298.00	18.00	1869.12	10384.00		2026-10-24 09:37:39.96605+05:30
186	96	INV-2026-1082	SRV-RCK-42	42U Server Rack Closed Smart Cooling	NOS	8537	7.00	48500.00	0.00	48500.00	18.00	61110.00	339500.00		2026-10-24 09:37:39.966887+05:30
187	97	INV-2026-1083	EX-LED-BAT	Emergency LED Exit Light 3h Backup	NOS	9405	1.00	1298.00	0.00	1298.00	18.00	233.64	1298.00		2026-10-24 09:37:39.969337+05:30
188	98	INV-2026-1084	CS-BOOT-9	Chemical Resistant Steel Toe Shoes S3	NOS	6403	8.00	2072.00	0.00	2072.00	18.00	2983.68	16576.00		2026-10-24 09:37:39.971672+05:30
189	98	INV-2026-1084	GM-FFP3	Full Face Chemical Gas Mask FFP3	NOS	9020	8.00	3363.00	0.00	3363.00	18.00	4842.72	26904.00		2026-10-24 09:37:39.972301+05:30
190	98	INV-2026-1084	HR-SWV-30	Swinging Hose Reel Drum 30m with Nozzle	NOS	8424	1.00	7316.00	0.00	7316.00	18.00	1316.88	7316.00		2026-10-24 09:37:39.972887+05:30
191	99	INV-2026-1085	SP-HDR-68	Pendant Sprinkler Head 68°C Red Bulb	NOS	8424	2.00	767.00	0.00	767.00	18.00	276.12	1534.00		2026-10-24 09:37:39.975068+05:30
192	100	INV-2026-1086	CF-EXT-50	Chemical Foam Fire Ext. 50L Trolley	NOS	8424	5.00	9912.00	0.00	9912.00	18.00	8920.80	49560.00		2026-10-24 09:37:39.97725+05:30
193	100	INV-2026-1086	GM-FFP3	Full Face Chemical Gas Mask FFP3	NOS	9020	1.00	3363.00	0.00	3363.00	18.00	605.34	3363.00		2026-10-24 09:37:39.977769+05:30
194	101	INV-2026-1087	FE-ABC-4	ABC Dry Powder Fire Ext. 4kg	NOS	8424	7.00	1321.60	0.00	1321.60	18.00	1665.22	9251.20		2026-10-24 09:37:39.979856+05:30
195	102	INV-2026-1088	SP-HDR-68	Pendant Sprinkler Head 68°C Red Bulb	NOS	8424	8.00	767.00	0.00	767.00	18.00	1104.48	6136.00		2026-10-24 09:37:39.981864+05:30
196	103	INV-2026-1089	EX-LED-BAT	Emergency LED Exit Light 3h Backup	NOS	9405	3.00	1298.00	0.00	1298.00	18.00	700.92	3894.00		2026-10-24 09:37:39.983688+05:30
197	103	INV-2026-1089	HAZ-TYP3	Tychem 6000 Hazmat Liquid Suit	NOS	6210	2.00	7168.00	0.00	7168.00	18.00	2580.48	14336.00		2026-10-24 09:37:39.984183+05:30
198	103	INV-2026-1089	HT-GLV-500	500°C Heat Resistant Aluminized Gloves	NOS	6116	8.00	1848.00	0.00	1848.00	18.00	2661.12	14784.00		2026-10-24 09:37:39.984618+05:30
199	104	INV-2026-1090	HR-SWV-30	Swinging Hose Reel Drum 30m with Nozzle	NOS	8424	6.00	7316.00	0.00	7316.00	18.00	7901.28	43896.00		2026-10-24 09:37:39.987634+05:30
200	104	INV-2026-1090	CF-EXT-50	Chemical Foam Fire Ext. 50L Trolley	NOS	8424	1.00	9912.00	0.00	9912.00	18.00	1784.16	9912.00		2026-10-24 09:37:39.988493+05:30
201	105	INV-2026-1091	CS-BOOT-9	Chemical Resistant Steel Toe Shoes S3	NOS	6403	8.00	2072.00	0.00	2072.00	18.00	2983.68	16576.00		2026-10-24 09:37:39.991029+05:30
202	105	INV-2026-1091	FBR-SFP-10	10G SFP+ Optical Transceiver Module 10km	NOS	8517	6.00	3650.00	0.00	3650.00	18.00	3942.00	21900.00		2026-10-24 09:37:39.99151+05:30
203	105	INV-2026-1091	HR-SWV-30	Swinging Hose Reel Drum 30m with Nozzle	NOS	8424	8.00	7316.00	0.00	7316.00	18.00	10535.04	58528.00		2026-10-24 09:37:39.991966+05:30
204	106	INV-2026-1092	SP-HDR-68	Pendant Sprinkler Head 68°C Red Bulb	NOS	8424	3.00	767.00	0.00	767.00	18.00	414.18	2301.00		2026-10-24 09:37:39.993921+05:30
205	106	INV-2026-1092	SH-M201	Safety Helmet M-201 ISI	NOS	6506	3.00	336.30	0.00	336.30	18.00	181.60	1008.90		2026-10-24 09:37:39.994671+05:30
206	107	INV-2026-1093	FBR-SFP-10	10G SFP+ Optical Transceiver Module 10km	NOS	8517	2.00	3650.00	0.00	3650.00	18.00	1314.00	7300.00		2026-10-24 09:37:39.998228+05:30
207	108	INV-2026-1094	HR-SWV-30	Swinging Hose Reel Drum 30m with Nozzle	NOS	8424	5.00	7316.00	0.00	7316.00	18.00	6584.40	36580.00		2026-10-24 09:37:39.999767+05:30
208	108	INV-2026-1094	EX-LED-BAT	Emergency LED Exit Light 3h Backup	NOS	9405	6.00	1298.00	0.00	1298.00	18.00	1401.84	7788.00		2026-10-24 09:37:40.000306+05:30
209	109	INV-2026-1095	HT-GLV-500	500°C Heat Resistant Aluminized Gloves	NOS	6116	4.00	1848.00	0.00	1848.00	18.00	1330.56	7392.00		2026-10-24 09:37:40.002526+05:30
210	109	INV-2026-1095	EX-LED-BAT	Emergency LED Exit Light 3h Backup	NOS	9405	8.00	1298.00	0.00	1298.00	18.00	1869.12	10384.00		2026-10-24 09:37:40.003193+05:30
211	110	INV-2026-1096	FR-SUT5	Fire Retardant Suit Type 5	NOS	6211	5.00	5040.00	0.00	5040.00	18.00	4536.00	25200.00		2026-10-24 09:37:40.005862+05:30
212	111	INV-2026-1097	RACK-PDU-16	Smart Metered Rack PDU 16A 230V 24 Outlets	NOS	8537	4.00	18500.00	0.00	18500.00	18.00	13320.00	74000.00		2026-10-24 09:37:40.007636+05:30
213	111	INV-2026-1097	SP-HDR-68	Pendant Sprinkler Head 68°C Red Bulb	NOS	8424	3.00	767.00	0.00	767.00	18.00	414.18	2301.00		2026-10-24 09:37:40.008483+05:30
214	112	INV-2026-1098	FB-HVY-2	Heavy Duty Fire Blanket 2x2m Fiberglass	NOS	7019	2.00	1475.00	0.00	1475.00	18.00	531.00	2950.00		2026-10-24 09:37:40.010732+05:30
215	113	INV-2026-1099	EX-LED-BAT	Emergency LED Exit Light 3h Backup	NOS	9405	7.00	1298.00	0.00	1298.00	18.00	1635.48	9086.00		2026-10-24 09:37:40.013098+05:30
216	113	INV-2026-1099	SRV-RCK-42	42U Server Rack Closed Smart Cooling	NOS	8537	8.00	48500.00	0.00	48500.00	18.00	69840.00	388000.00		2026-10-24 09:37:40.013611+05:30
217	113	INV-2026-1099	SP-HDR-68	Pendant Sprinkler Head 68°C Red Bulb	NOS	8424	7.00	767.00	0.00	767.00	18.00	966.42	5369.00		2026-10-24 09:37:40.01424+05:30
218	114	INV-2026-1100	FE-ABC-4	ABC Dry Powder Fire Ext. 4kg	NOS	8424	4.00	1321.60	0.00	1321.60	18.00	951.55	5286.40		2026-10-24 09:37:40.01614+05:30
219	114	INV-2026-1100	FA-KIT1	First Aid Kit Industrial	NOS	3006	6.00	952.00	0.00	952.00	18.00	1028.16	5712.00		2026-10-24 09:37:40.016742+05:30
220	114	INV-2026-1100	CS-BOOT-9	Chemical Resistant Steel Toe Shoes S3	NOS	6403	3.00	2072.00	0.00	2072.00	18.00	1118.88	6216.00		2026-10-24 09:37:40.017388+05:30
221	115	INV-2026-1101	GM-FFP3	Full Face Chemical Gas Mask FFP3	NOS	9020	2.00	3363.00	0.00	3363.00	18.00	1210.68	6726.00		2026-10-24 09:37:40.019901+05:30
222	115	INV-2026-1101	SP-HDR-68	Pendant Sprinkler Head 68°C Red Bulb	NOS	8424	5.00	767.00	0.00	767.00	18.00	690.30	3835.00		2026-10-24 09:37:40.020421+05:30
223	116	INV-2026-1102	UPS-3KVA-ON	3kVA Online UPS Pure Sine Wave 230V	NOS	8504	3.00	38200.00	0.00	38200.00	18.00	20628.00	114600.00		2026-10-24 09:37:40.023107+05:30
224	116	INV-2026-1102	LSR-SFT-GLS	Optical Fiber Laser Safety Protective Goggles	NOS	9004	3.00	5800.00	0.00	5800.00	18.00	3132.00	17400.00		2026-10-24 09:37:40.02385+05:30
225	117	INV-2026-1103	FA-KIT1	First Aid Kit Industrial	NOS	3006	5.00	952.00	0.00	952.00	18.00	856.80	4760.00		2026-10-24 09:37:40.025637+05:30
226	117	INV-2026-1103	FR-SUT5	Fire Retardant Suit Type 5	NOS	6211	7.00	5040.00	0.00	5040.00	18.00	6350.40	35280.00		2026-10-24 09:37:40.026101+05:30
227	117	INV-2026-1103	HR-SWV-30	Swinging Hose Reel Drum 30m with Nozzle	NOS	8424	3.00	7316.00	0.00	7316.00	18.00	3950.64	21948.00		2026-10-24 09:37:40.026509+05:30
228	118	INV-2026-1104	SP-HDR-68	Pendant Sprinkler Head 68°C Red Bulb	NOS	8424	3.00	767.00	0.00	767.00	18.00	414.18	2301.00		2026-10-24 09:37:40.027925+05:30
229	119	INV-2026-1105	FA-KIT1	First Aid Kit Industrial	NOS	3006	6.00	952.00	0.00	952.00	18.00	1028.16	5712.00		2026-10-24 09:37:40.03066+05:30
230	119	INV-2026-1105	HR-SWV-30	Swinging Hose Reel Drum 30m with Nozzle	NOS	8424	6.00	7316.00	0.00	7316.00	18.00	7901.28	43896.00		2026-10-24 09:37:40.031345+05:30
231	119	INV-2026-1105	EX-LED-BAT	Emergency LED Exit Light 3h Backup	NOS	9405	3.00	1298.00	0.00	1298.00	18.00	700.92	3894.00		2026-10-24 09:37:40.031941+05:30
232	120	INV-2026-1106	SH-M201	Safety Helmet M-201 ISI	NOS	6506	1.00	336.30	0.00	336.30	18.00	60.53	336.30		2026-10-24 09:37:40.033966+05:30
233	120	INV-2026-1106	EX-LED-BAT	Emergency LED Exit Light 3h Backup	NOS	9405	1.00	1298.00	0.00	1298.00	18.00	233.64	1298.00		2026-10-24 09:37:40.034449+05:30
234	120	INV-2026-1106	FB-HVY-2	Heavy Duty Fire Blanket 2x2m Fiberglass	NOS	7019	7.00	1475.00	0.00	1475.00	18.00	1858.50	10325.00		2026-10-24 09:37:40.034861+05:30
235	121	INV-2026-1107	SM-DET1	Smoke Detector Photoelectric	NOS	8531	8.00	1416.00	0.00	1416.00	18.00	2039.04	11328.00		2026-10-24 09:37:40.03685+05:30
236	122	INV-2026-1108	CF-EXT-50	Chemical Foam Fire Ext. 50L Trolley	NOS	8424	2.00	9912.00	0.00	9912.00	18.00	3568.32	19824.00		2026-10-24 09:37:40.039216+05:30
237	122	INV-2026-1108	CAT6A-100M	10Gbps Shielded Cat6A Cable Roll 100m	NOS	8544	3.00	4950.00	0.00	4950.00	18.00	2673.00	14850.00		2026-10-24 09:37:40.039781+05:30
238	123	INV-2026-1109	SG-CL01	Safety Goggles Clear Lens	NOS	9004	8.00	171.10	0.00	171.10	18.00	246.38	1368.80		2026-10-24 09:37:40.04148+05:30
239	123	INV-2026-1109	FA-KIT1	First Aid Kit Industrial	NOS	3006	5.00	952.00	0.00	952.00	18.00	856.80	4760.00		2026-10-24 09:37:40.041985+05:30
240	124	INV-2026-1110	FE-CO2-2	CO2 Fire Extinguisher 2kg	NOS	8424	5.00	2891.00	0.00	2891.00	18.00	2601.90	14455.00		2026-10-24 09:37:40.043852+05:30
241	124	INV-2026-1110	HT-GLV-500	500°C Heat Resistant Aluminized Gloves	NOS	6116	6.00	1848.00	0.00	1848.00	18.00	1995.84	11088.00		2026-10-24 09:37:40.044395+05:30
242	125	INV-2026-1111	FBR-SFP-10	10G SFP+ Optical Transceiver Module 10km	NOS	8517	1.00	3650.00	0.00	3650.00	18.00	657.00	3650.00		2026-10-24 09:37:40.048361+05:30
243	125	INV-2026-1111	SP-HDR-68	Pendant Sprinkler Head 68°C Red Bulb	NOS	8424	3.00	767.00	0.00	767.00	18.00	414.18	2301.00		2026-10-24 09:37:40.049153+05:30
244	126	INV-2026-1112	CF-EXT-50	Chemical Foam Fire Ext. 50L Trolley	NOS	8424	6.00	9912.00	0.00	9912.00	18.00	10704.96	59472.00		2026-10-24 09:37:40.052631+05:30
245	126	INV-2026-1112	ESD-MAT-01	Anti-Static ESD Grounding Mat 2x1m	NOS	3926	4.00	2450.00	0.00	2450.00	18.00	1764.00	9800.00		2026-10-24 09:37:40.054005+05:30
246	126	INV-2026-1112	FR-SUT5	Fire Retardant Suit Type 5	NOS	6211	1.00	5040.00	0.00	5040.00	18.00	907.20	5040.00		2026-10-24 09:37:40.054864+05:30
247	127	INV-2026-1113	SP-HDR-68	Pendant Sprinkler Head 68°C Red Bulb	NOS	8424	1.00	767.00	0.00	767.00	18.00	138.06	767.00		2026-10-24 09:37:40.056809+05:30
248	127	INV-2026-1113	GM-FFP3	Full Face Chemical Gas Mask FFP3	NOS	9020	8.00	3363.00	0.00	3363.00	18.00	4842.72	26904.00		2026-10-24 09:37:40.057572+05:30
249	128	INV-2026-1114	ESD-MAT-01	Anti-Static ESD Grounding Mat 2x1m	NOS	3926	7.00	2450.00	0.00	2450.00	18.00	3087.00	17150.00		2026-10-24 09:37:40.060625+05:30
250	129	INV-2026-1115	HR-SWV-30	Swinging Hose Reel Drum 30m with Nozzle	NOS	8424	3.00	7316.00	0.00	7316.00	18.00	3950.64	21948.00		2026-10-24 09:37:40.062363+05:30
251	130	INV-2026-1116	HR-SWV-30	Swinging Hose Reel Drum 30m with Nozzle	NOS	8424	4.00	7316.00	0.00	7316.00	18.00	5267.52	29264.00		2026-10-24 09:37:40.06504+05:30
252	131	INV-2026-1117	SM-DET1	Smoke Detector Photoelectric	NOS	8531	7.00	1416.00	0.00	1416.00	18.00	1784.16	9912.00		2026-10-24 09:37:40.067294+05:30
253	131	INV-2026-1117	FR-SUT5	Fire Retardant Suit Type 5	NOS	6211	6.00	5040.00	0.00	5040.00	18.00	5443.20	30240.00		2026-10-24 09:37:40.067739+05:30
254	132	INV-2026-1118	FBR-SFP-10	10G SFP+ Optical Transceiver Module 10km	NOS	8517	3.00	3650.00	0.00	3650.00	18.00	1971.00	10950.00		2026-10-24 09:37:40.069244+05:30
255	133	INV-2026-1119	FA-KIT1	First Aid Kit Industrial	NOS	3006	4.00	952.00	0.00	952.00	18.00	685.44	3808.00		2026-10-24 09:37:40.070788+05:30
256	133	INV-2026-1119	SM-DET1	Smoke Detector Photoelectric	NOS	8531	3.00	1416.00	0.00	1416.00	18.00	764.64	4248.00		2026-10-24 09:37:40.071444+05:30
257	133	INV-2026-1119	RACK-PDU-16	Smart Metered Rack PDU 16A 230V 24 Outlets	NOS	8537	3.00	18500.00	0.00	18500.00	18.00	9990.00	55500.00		2026-10-24 09:37:40.072118+05:30
258	134	INV-2026-1120	FA-KIT1	First Aid Kit Industrial	NOS	3006	1.00	952.00	0.00	952.00	18.00	171.36	952.00		2026-10-24 09:37:40.074399+05:30
259	134	INV-2026-1120	SG-CL01	Safety Goggles Clear Lens	NOS	9004	7.00	171.10	0.00	171.10	18.00	215.59	1197.70		2026-10-24 09:37:40.07494+05:30
260	134	INV-2026-1120	SRV-RCK-42	42U Server Rack Closed Smart Cooling	NOS	8537	6.00	48500.00	0.00	48500.00	18.00	52380.00	291000.00		2026-10-24 09:37:40.075479+05:30
261	135	INV-2026-1121	SRV-RCK-42	42U Server Rack Closed Smart Cooling	NOS	8537	2.00	48500.00	0.00	48500.00	18.00	17460.00	97000.00		2026-10-24 09:37:40.077738+05:30
262	136	INV-2026-1122	EX-LED-BAT	Emergency LED Exit Light 3h Backup	NOS	9405	2.00	1298.00	0.00	1298.00	18.00	467.28	2596.00		2026-10-24 09:37:40.079832+05:30
263	137	INV-2026-1123	SG-CL01	Safety Goggles Clear Lens	NOS	9004	1.00	171.10	0.00	171.10	18.00	30.80	171.10		2026-10-24 09:37:40.081856+05:30
264	137	INV-2026-1123	FR-SUT5	Fire Retardant Suit Type 5	NOS	6211	6.00	5040.00	0.00	5040.00	18.00	5443.20	30240.00		2026-10-24 09:37:40.082314+05:30
265	138	INV-2026-1124	FBR-SFP-10	10G SFP+ Optical Transceiver Module 10km	NOS	8517	7.00	3650.00	0.00	3650.00	18.00	4599.00	25550.00		2026-10-24 09:37:40.084039+05:30
266	138	INV-2026-1124	HR-SWV-30	Swinging Hose Reel Drum 30m with Nozzle	NOS	8424	7.00	7316.00	0.00	7316.00	18.00	9218.16	51212.00		2026-10-24 09:37:40.084769+05:30
267	138	INV-2026-1124	GM-FFP3	Full Face Chemical Gas Mask FFP3	NOS	9020	1.00	3363.00	0.00	3363.00	18.00	605.34	3363.00		2026-10-24 09:37:40.0854+05:30
268	139	INV-2026-1125	SP-HDR-68	Pendant Sprinkler Head 68°C Red Bulb	NOS	8424	5.00	767.00	0.00	767.00	18.00	690.30	3835.00		2026-10-24 09:37:40.087284+05:30
269	139	INV-2026-1125	FW-GW-10G	10Gbps Enterprise Next-Gen Firewall Gateway	NOS	8517	2.00	94500.00	0.00	94500.00	18.00	34020.00	189000.00		2026-10-24 09:37:40.087869+05:30
270	140	INV-2026-1126	FB-HVY-2	Heavy Duty Fire Blanket 2x2m Fiberglass	NOS	7019	2.00	1475.00	0.00	1475.00	18.00	531.00	2950.00		2026-10-24 09:37:40.090599+05:30
271	141	INV-2026-1127	CS-BOOT-9	Chemical Resistant Steel Toe Shoes S3	NOS	6403	2.00	2072.00	0.00	2072.00	18.00	745.92	4144.00		2026-10-24 09:37:40.092524+05:30
272	141	INV-2026-1127	FW-GW-10G	10Gbps Enterprise Next-Gen Firewall Gateway	NOS	8517	7.00	94500.00	0.00	94500.00	18.00	119070.00	661500.00		2026-10-24 09:37:40.093117+05:30
273	141	INV-2026-1127	FW-GW-10G	10Gbps Enterprise Next-Gen Firewall Gateway	NOS	8517	2.00	94500.00	0.00	94500.00	18.00	34020.00	189000.00		2026-10-24 09:37:40.093621+05:30
274	142	INV-2026-1128	FB-HVY-2	Heavy Duty Fire Blanket 2x2m Fiberglass	NOS	7019	2.00	1475.00	0.00	1475.00	18.00	531.00	2950.00		2026-10-24 09:37:40.095444+05:30
275	142	INV-2026-1128	CAT6A-100M	10Gbps Shielded Cat6A Cable Roll 100m	NOS	8544	1.00	4950.00	0.00	4950.00	18.00	891.00	4950.00		2026-10-24 09:37:40.095976+05:30
276	143	INV-2026-1129	SP-HDR-68	Pendant Sprinkler Head 68°C Red Bulb	NOS	8424	4.00	767.00	0.00	767.00	18.00	552.24	3068.00		2026-10-24 09:37:40.097964+05:30
277	144	INV-2026-1130	SH-M201	Safety Helmet M-201 ISI	NOS	6506	1.00	336.30	0.00	336.30	18.00	60.53	336.30		2026-10-24 09:37:40.100336+05:30
278	144	INV-2026-1130	FR-SUT5	Fire Retardant Suit Type 5	NOS	6211	1.00	5040.00	0.00	5040.00	18.00	907.20	5040.00		2026-10-24 09:37:40.101025+05:30
279	145	INV-2026-1131	RACK-PDU-16	Smart Metered Rack PDU 16A 230V 24 Outlets	NOS	8537	4.00	18500.00	0.00	18500.00	18.00	13320.00	74000.00		2026-10-24 09:37:40.10439+05:30
280	146	INV-2026-1132	LSR-SFT-GLS	Optical Fiber Laser Safety Protective Goggles	NOS	9004	3.00	5800.00	0.00	5800.00	18.00	3132.00	17400.00		2026-10-24 09:37:40.108177+05:30
281	146	INV-2026-1132	HT-GLV-500	500°C Heat Resistant Aluminized Gloves	NOS	6116	3.00	1848.00	0.00	1848.00	18.00	997.92	5544.00		2026-10-24 09:37:40.108738+05:30
282	147	INV-2026-1133	HT-GLV-500	500°C Heat Resistant Aluminized Gloves	NOS	6116	7.00	1848.00	0.00	1848.00	18.00	2328.48	12936.00		2026-10-24 09:37:40.110337+05:30
283	147	INV-2026-1133	FR-SUT5	Fire Retardant Suit Type 5	NOS	6211	5.00	5040.00	0.00	5040.00	18.00	4536.00	25200.00		2026-10-24 09:37:40.111019+05:30
284	147	INV-2026-1133	EX-LED-BAT	Emergency LED Exit Light 3h Backup	NOS	9405	2.00	1298.00	0.00	1298.00	18.00	467.28	2596.00		2026-10-24 09:37:40.11157+05:30
285	148	INV-2026-1134	ESD-MAT-01	Anti-Static ESD Grounding Mat 2x1m	NOS	3926	7.00	2450.00	0.00	2450.00	18.00	3087.00	17150.00		2026-10-24 09:37:40.113849+05:30
286	148	INV-2026-1134	FE-ABC-4	ABC Dry Powder Fire Ext. 4kg	NOS	8424	5.00	1321.60	0.00	1321.60	18.00	1189.44	6608.00		2026-10-24 09:37:40.114591+05:30
287	148	INV-2026-1134	SP-HDR-68	Pendant Sprinkler Head 68°C Red Bulb	NOS	8424	1.00	767.00	0.00	767.00	18.00	138.06	767.00		2026-10-24 09:37:40.115083+05:30
288	149	INV-2026-1135	EX-LED-BAT	Emergency LED Exit Light 3h Backup	NOS	9405	3.00	1298.00	0.00	1298.00	18.00	700.92	3894.00		2026-10-24 09:37:40.11692+05:30
289	150	INV-2026-1136	SRV-RCK-42	42U Server Rack Closed Smart Cooling	NOS	8537	6.00	48500.00	0.00	48500.00	18.00	52380.00	291000.00		2026-10-24 09:37:40.122849+05:30
290	150	INV-2026-1136	FE-CO2-2	CO2 Fire Extinguisher 2kg	NOS	8424	4.00	2891.00	0.00	2891.00	18.00	2081.52	11564.00		2026-10-24 09:37:40.12328+05:30
291	150	INV-2026-1136	SP-HDR-68	Pendant Sprinkler Head 68°C Red Bulb	NOS	8424	2.00	767.00	0.00	767.00	18.00	276.12	1534.00		2026-10-24 09:37:40.123831+05:30
292	151	INV-2026-1137	FE-ABC-4	ABC Dry Powder Fire Ext. 4kg	NOS	8424	2.00	1321.60	0.00	1321.60	18.00	475.78	2643.20		2026-10-24 09:37:40.125212+05:30
293	152	INV-2026-1138	EX-LED-BAT	Emergency LED Exit Light 3h Backup	NOS	9405	7.00	1298.00	0.00	1298.00	18.00	1635.48	9086.00		2026-10-24 09:37:40.12919+05:30
294	152	INV-2026-1138	CAT6A-100M	10Gbps Shielded Cat6A Cable Roll 100m	NOS	8544	8.00	4950.00	0.00	4950.00	18.00	7128.00	39600.00		2026-10-24 09:37:40.12988+05:30
295	152	INV-2026-1138	EX-LED-BAT	Emergency LED Exit Light 3h Backup	NOS	9405	6.00	1298.00	0.00	1298.00	18.00	1401.84	7788.00		2026-10-24 09:37:40.130361+05:30
296	153	INV-2026-1139	RACK-PDU-16	Smart Metered Rack PDU 16A 230V 24 Outlets	NOS	8537	5.00	18500.00	0.00	18500.00	18.00	16650.00	92500.00		2026-10-24 09:37:40.132056+05:30
297	154	INV-2026-1140	SM-DET1	Smoke Detector Photoelectric	NOS	8531	3.00	1416.00	0.00	1416.00	18.00	764.64	4248.00		2026-10-24 09:37:40.134077+05:30
298	154	INV-2026-1140	FB-HVY-2	Heavy Duty Fire Blanket 2x2m Fiberglass	NOS	7019	3.00	1475.00	0.00	1475.00	18.00	796.50	4425.00		2026-10-24 09:37:40.134636+05:30
299	154	INV-2026-1140	FW-GW-10G	10Gbps Enterprise Next-Gen Firewall Gateway	NOS	8517	2.00	94500.00	0.00	94500.00	18.00	34020.00	189000.00		2026-10-24 09:37:40.135188+05:30
300	155	INV-2026-1141	CS-BOOT-9	Chemical Resistant Steel Toe Shoes S3	NOS	6403	6.00	2072.00	0.00	2072.00	18.00	2237.76	12432.00		2026-10-24 09:37:40.137688+05:30
301	155	INV-2026-1141	EX-LED-BAT	Emergency LED Exit Light 3h Backup	NOS	9405	2.00	1298.00	0.00	1298.00	18.00	467.28	2596.00		2026-10-24 09:37:40.138083+05:30
302	155	INV-2026-1141	SM-DET1	Smoke Detector Photoelectric	NOS	8531	1.00	1416.00	0.00	1416.00	18.00	254.88	1416.00		2026-10-24 09:37:40.138396+05:30
303	156	INV-2026-1142	FE-ABC-4	ABC Dry Powder Fire Ext. 4kg	NOS	8424	7.00	1321.60	0.00	1321.60	18.00	1665.22	9251.20		2026-10-24 09:37:40.139611+05:30
304	156	INV-2026-1142	HT-GLV-500	500°C Heat Resistant Aluminized Gloves	NOS	6116	8.00	1848.00	0.00	1848.00	18.00	2661.12	14784.00		2026-10-24 09:37:40.140138+05:30
305	156	INV-2026-1142	RACK-PDU-16	Smart Metered Rack PDU 16A 230V 24 Outlets	NOS	8537	3.00	18500.00	0.00	18500.00	18.00	9990.00	55500.00		2026-10-24 09:37:40.140591+05:30
306	157	INV-2026-1143	HT-GLV-500	500°C Heat Resistant Aluminized Gloves	NOS	6116	8.00	1848.00	0.00	1848.00	18.00	2661.12	14784.00		2026-10-24 09:37:40.142061+05:30
307	158	INV-2026-1144	SP-HDR-68	Pendant Sprinkler Head 68°C Red Bulb	NOS	8424	2.00	767.00	0.00	767.00	18.00	276.12	1534.00		2026-10-24 09:37:40.144314+05:30
308	159	INV-2026-1145	FB-HVY-2	Heavy Duty Fire Blanket 2x2m Fiberglass	NOS	7019	7.00	1475.00	0.00	1475.00	18.00	1858.50	10325.00		2026-10-24 09:37:40.145478+05:30
309	159	INV-2026-1145	RACK-PDU-16	Smart Metered Rack PDU 16A 230V 24 Outlets	NOS	8537	3.00	18500.00	0.00	18500.00	18.00	9990.00	55500.00		2026-10-24 09:37:40.145821+05:30
310	159	INV-2026-1145	HAZ-TYP3	Tychem 6000 Hazmat Liquid Suit	NOS	6210	3.00	7168.00	0.00	7168.00	18.00	3870.72	21504.00		2026-10-24 09:37:40.14613+05:30
311	160	INV-2026-1146	EX-LED-BAT	Emergency LED Exit Light 3h Backup	NOS	9405	3.00	1298.00	0.00	1298.00	18.00	700.92	3894.00		2026-10-24 09:37:40.148157+05:30
312	161	INV-2026-1147	SRV-RCK-42	42U Server Rack Closed Smart Cooling	NOS	8537	2.00	48500.00	0.00	48500.00	18.00	17460.00	97000.00		2026-10-24 09:37:40.149942+05:30
313	161	INV-2026-1147	HT-GLV-500	500°C Heat Resistant Aluminized Gloves	NOS	6116	7.00	1848.00	0.00	1848.00	18.00	2328.48	12936.00		2026-10-24 09:37:40.150273+05:30
314	161	INV-2026-1147	FA-KIT1	First Aid Kit Industrial	NOS	3006	5.00	952.00	0.00	952.00	18.00	856.80	4760.00		2026-10-24 09:37:40.150599+05:30
315	162	INV-2026-1148	GM-FFP3	Full Face Chemical Gas Mask FFP3	NOS	9020	5.00	3363.00	0.00	3363.00	18.00	3026.70	16815.00		2026-10-24 09:37:40.151802+05:30
316	163	INV-2026-1149	HR-SWV-30	Swinging Hose Reel Drum 30m with Nozzle	NOS	8424	8.00	7316.00	0.00	7316.00	18.00	10535.04	58528.00		2026-10-24 09:37:40.152805+05:30
317	164	INV-2026-1150	SRV-RCK-42	42U Server Rack Closed Smart Cooling	NOS	8537	2.00	48500.00	0.00	48500.00	18.00	17460.00	97000.00		2026-10-24 09:37:40.155072+05:30
318	164	INV-2026-1150	GM-FFP3	Full Face Chemical Gas Mask FFP3	NOS	9020	8.00	3363.00	0.00	3363.00	18.00	4842.72	26904.00		2026-10-24 09:37:40.155597+05:30
319	164	INV-2026-1150	FR-SUT5	Fire Retardant Suit Type 5	NOS	6211	1.00	5040.00	0.00	5040.00	18.00	907.20	5040.00		2026-10-24 09:37:40.156035+05:30
320	165	INV-2026-1151	SRV-RCK-42	42U Server Rack Closed Smart Cooling	NOS	8537	8.00	48500.00	0.00	48500.00	18.00	69840.00	388000.00		2026-10-24 09:37:40.157873+05:30
321	165	INV-2026-1151	RACK-PDU-16	Smart Metered Rack PDU 16A 230V 24 Outlets	NOS	8537	6.00	18500.00	0.00	18500.00	18.00	19980.00	111000.00		2026-10-24 09:37:40.158247+05:30
322	166	INV-2026-1152	FA-KIT1	First Aid Kit Industrial	NOS	3006	6.00	952.00	0.00	952.00	18.00	1028.16	5712.00		2026-10-24 09:37:40.15938+05:30
323	167	INV-2026-1153	FE-ABC-4	ABC Dry Powder Fire Ext. 4kg	NOS	8424	8.00	1321.60	0.00	1321.60	18.00	1903.10	10572.80		2026-10-24 09:37:40.161054+05:30
324	167	INV-2026-1153	RACK-PDU-16	Smart Metered Rack PDU 16A 230V 24 Outlets	NOS	8537	6.00	18500.00	0.00	18500.00	18.00	19980.00	111000.00		2026-10-24 09:37:40.161453+05:30
325	168	INV-2026-1154	LSR-SFT-GLS	Optical Fiber Laser Safety Protective Goggles	NOS	9004	7.00	5800.00	0.00	5800.00	18.00	7308.00	40600.00		2026-10-24 09:37:40.163057+05:30
326	168	INV-2026-1154	FE-CO2-2	CO2 Fire Extinguisher 2kg	NOS	8424	4.00	2891.00	0.00	2891.00	18.00	2081.52	11564.00		2026-10-24 09:37:40.163559+05:30
327	168	INV-2026-1154	ESD-MAT-01	Anti-Static ESD Grounding Mat 2x1m	NOS	3926	3.00	2450.00	0.00	2450.00	18.00	1323.00	7350.00		2026-10-24 09:37:40.163982+05:30
328	169	INV-2026-1155	FE-ABC-4	ABC Dry Powder Fire Ext. 4kg	NOS	8424	6.00	1321.60	0.00	1321.60	18.00	1427.33	7929.60		2026-10-24 09:37:40.165131+05:30
329	169	INV-2026-1155	SH-M201	Safety Helmet M-201 ISI	NOS	6506	5.00	336.30	0.00	336.30	18.00	302.67	1681.50		2026-10-24 09:37:40.165466+05:30
330	169	INV-2026-1155	ESD-MAT-01	Anti-Static ESD Grounding Mat 2x1m	NOS	3926	4.00	2450.00	0.00	2450.00	18.00	1764.00	9800.00		2026-10-24 09:37:40.165748+05:30
331	170	INV-2026-1156	EX-LED-BAT	Emergency LED Exit Light 3h Backup	NOS	9405	5.00	1298.00	0.00	1298.00	18.00	1168.20	6490.00		2026-10-24 09:37:40.168002+05:30
332	171	INV-2026-1157	HR-SWV-30	Swinging Hose Reel Drum 30m with Nozzle	NOS	8424	2.00	7316.00	0.00	7316.00	18.00	2633.76	14632.00		2026-10-24 09:37:40.16977+05:30
333	171	INV-2026-1157	SRV-RCK-42	42U Server Rack Closed Smart Cooling	NOS	8537	6.00	48500.00	0.00	48500.00	18.00	52380.00	291000.00		2026-10-24 09:37:40.170246+05:30
334	172	INV-2026-1158	HT-GLV-500	500°C Heat Resistant Aluminized Gloves	NOS	6116	3.00	1848.00	0.00	1848.00	18.00	997.92	5544.00		2026-10-24 09:37:40.171524+05:30
335	172	INV-2026-1158	HR-SWV-30	Swinging Hose Reel Drum 30m with Nozzle	NOS	8424	8.00	7316.00	0.00	7316.00	18.00	10535.04	58528.00		2026-10-24 09:37:40.171864+05:30
336	172	INV-2026-1158	CAT6A-100M	10Gbps Shielded Cat6A Cable Roll 100m	NOS	8544	1.00	4950.00	0.00	4950.00	18.00	891.00	4950.00		2026-10-24 09:37:40.172154+05:30
337	173	INV-2026-1159	UPS-3KVA-ON	3kVA Online UPS Pure Sine Wave 230V	NOS	8504	5.00	38200.00	0.00	38200.00	18.00	34380.00	191000.00		2026-10-24 09:37:40.173913+05:30
338	174	INV-2026-1160	RACK-PDU-16	Smart Metered Rack PDU 16A 230V 24 Outlets	NOS	8537	3.00	18500.00	0.00	18500.00	18.00	9990.00	55500.00		2026-10-24 09:37:40.17531+05:30
339	174	INV-2026-1160	HAZ-TYP3	Tychem 6000 Hazmat Liquid Suit	NOS	6210	1.00	7168.00	0.00	7168.00	18.00	1290.24	7168.00		2026-10-24 09:37:40.175753+05:30
340	174	INV-2026-1160	SRV-RCK-42	42U Server Rack Closed Smart Cooling	NOS	8537	4.00	48500.00	0.00	48500.00	18.00	34920.00	194000.00		2026-10-24 09:37:40.176228+05:30
341	175	INV-2026-1161	FR-SUT5	Fire Retardant Suit Type 5	NOS	6211	6.00	5040.00	0.00	5040.00	18.00	5443.20	30240.00		2026-10-24 09:37:40.17821+05:30
342	175	INV-2026-1161	LSR-SFT-GLS	Optical Fiber Laser Safety Protective Goggles	NOS	9004	3.00	5800.00	0.00	5800.00	18.00	3132.00	17400.00		2026-10-24 09:37:40.178575+05:30
343	176	INV-2026-1162	FE-ABC-4	ABC Dry Powder Fire Ext. 4kg	NOS	8424	2.00	1321.60	0.00	1321.60	18.00	475.78	2643.20		2026-10-24 09:37:40.179921+05:30
344	176	INV-2026-1162	CF-EXT-50	Chemical Foam Fire Ext. 50L Trolley	NOS	8424	1.00	9912.00	0.00	9912.00	18.00	1784.16	9912.00		2026-10-24 09:37:40.180257+05:30
345	177	INV-2026-1163	CF-EXT-50	Chemical Foam Fire Ext. 50L Trolley	NOS	8424	5.00	9912.00	0.00	9912.00	18.00	8920.80	49560.00		2026-10-24 09:37:40.181735+05:30
346	177	INV-2026-1163	SG-CL01	Safety Goggles Clear Lens	NOS	9004	1.00	171.10	0.00	171.10	18.00	30.80	171.10		2026-10-24 09:37:40.182231+05:30
347	178	INV-2026-1164	HT-GLV-500	500°C Heat Resistant Aluminized Gloves	NOS	6116	4.00	1848.00	0.00	1848.00	18.00	1330.56	7392.00		2026-10-24 09:37:40.183719+05:30
348	179	INV-2026-1165	SG-CL01	Safety Goggles Clear Lens	NOS	9004	7.00	171.10	0.00	171.10	18.00	215.59	1197.70		2026-10-24 09:37:40.185281+05:30
349	179	INV-2026-1165	FE-CO2-2	CO2 Fire Extinguisher 2kg	NOS	8424	1.00	2891.00	0.00	2891.00	18.00	520.38	2891.00		2026-10-24 09:37:40.185786+05:30
350	179	INV-2026-1165	FB-HVY-2	Heavy Duty Fire Blanket 2x2m Fiberglass	NOS	7019	1.00	1475.00	0.00	1475.00	18.00	265.50	1475.00		2026-10-24 09:37:40.186129+05:30
351	180	INV-2026-1166	HR-SWV-30	Swinging Hose Reel Drum 30m with Nozzle	NOS	8424	5.00	7316.00	0.00	7316.00	18.00	6584.40	36580.00		2026-10-24 09:37:40.187611+05:30
352	180	INV-2026-1166	SM-DET1	Smoke Detector Photoelectric	NOS	8531	4.00	1416.00	0.00	1416.00	18.00	1019.52	5664.00		2026-10-24 09:37:40.188028+05:30
353	180	INV-2026-1166	SP-HDR-68	Pendant Sprinkler Head 68°C Red Bulb	NOS	8424	1.00	767.00	0.00	767.00	18.00	138.06	767.00		2026-10-24 09:37:40.188542+05:30
354	181	INV-2026-1167	SRV-RCK-42	42U Server Rack Closed Smart Cooling	NOS	8537	4.00	48500.00	0.00	48500.00	18.00	34920.00	194000.00		2026-10-24 09:37:40.189891+05:30
355	181	INV-2026-1167	SP-HDR-68	Pendant Sprinkler Head 68°C Red Bulb	NOS	8424	6.00	767.00	0.00	767.00	18.00	828.36	4602.00		2026-10-24 09:37:40.19027+05:30
356	182	INV-2026-1168	EX-LED-BAT	Emergency LED Exit Light 3h Backup	NOS	9405	5.00	1298.00	0.00	1298.00	18.00	1168.20	6490.00		2026-10-24 09:37:40.19192+05:30
357	183	INV-2026-1169	FW-GW-10G	10Gbps Enterprise Next-Gen Firewall Gateway	NOS	8517	2.00	94500.00	0.00	94500.00	18.00	34020.00	189000.00		2026-10-24 09:37:40.192911+05:30
358	183	INV-2026-1169	HT-GLV-500	500°C Heat Resistant Aluminized Gloves	NOS	6116	6.00	1848.00	0.00	1848.00	18.00	1995.84	11088.00		2026-10-24 09:37:40.193231+05:30
359	184	INV-2026-1170	FB-HVY-2	Heavy Duty Fire Blanket 2x2m Fiberglass	NOS	7019	5.00	1475.00	0.00	1475.00	18.00	1327.50	7375.00		2026-10-24 09:37:40.194306+05:30
360	185	INV-2026-1171	FBR-SFP-10	10G SFP+ Optical Transceiver Module 10km	NOS	8517	5.00	3650.00	0.00	3650.00	18.00	3285.00	18250.00		2026-10-24 09:37:40.196533+05:30
361	185	INV-2026-1171	RACK-PDU-16	Smart Metered Rack PDU 16A 230V 24 Outlets	NOS	8537	6.00	18500.00	0.00	18500.00	18.00	19980.00	111000.00		2026-10-24 09:37:40.196986+05:30
362	185	INV-2026-1171	FE-ABC-4	ABC Dry Powder Fire Ext. 4kg	NOS	8424	2.00	1321.60	0.00	1321.60	18.00	475.78	2643.20		2026-10-24 09:37:40.197488+05:30
363	186	INV-2026-1172	HR-SWV-30	Swinging Hose Reel Drum 30m with Nozzle	NOS	8424	8.00	7316.00	0.00	7316.00	18.00	10535.04	58528.00		2026-10-24 09:37:40.199483+05:30
364	187	INV-2026-1173	UPS-3KVA-ON	3kVA Online UPS Pure Sine Wave 230V	NOS	8504	7.00	38200.00	0.00	38200.00	18.00	48132.00	267400.00		2026-10-24 09:37:40.200513+05:30
365	187	INV-2026-1173	ESD-MAT-01	Anti-Static ESD Grounding Mat 2x1m	NOS	3926	2.00	2450.00	0.00	2450.00	18.00	882.00	4900.00		2026-10-24 09:37:40.200903+05:30
366	188	INV-2026-1174	EX-LED-BAT	Emergency LED Exit Light 3h Backup	NOS	9405	6.00	1298.00	0.00	1298.00	18.00	1401.84	7788.00		2026-10-24 09:37:40.202617+05:30
367	188	INV-2026-1174	HAZ-TYP3	Tychem 6000 Hazmat Liquid Suit	NOS	6210	6.00	7168.00	0.00	7168.00	18.00	7741.44	43008.00		2026-10-24 09:37:40.203197+05:30
368	188	INV-2026-1174	HT-GLV-500	500°C Heat Resistant Aluminized Gloves	NOS	6116	7.00	1848.00	0.00	1848.00	18.00	2328.48	12936.00		2026-10-24 09:37:40.203677+05:30
369	189	INV-2026-1175	RACK-PDU-16	Smart Metered Rack PDU 16A 230V 24 Outlets	NOS	8537	7.00	18500.00	0.00	18500.00	18.00	23310.00	129500.00		2026-10-24 09:37:40.20527+05:30
370	189	INV-2026-1175	EX-LED-BAT	Emergency LED Exit Light 3h Backup	NOS	9405	1.00	1298.00	0.00	1298.00	18.00	233.64	1298.00		2026-10-24 09:37:40.205688+05:30
371	190	INV-2026-1176	LSR-SFT-GLS	Optical Fiber Laser Safety Protective Goggles	NOS	9004	8.00	5800.00	0.00	5800.00	18.00	8352.00	46400.00		2026-10-24 09:37:40.207764+05:30
372	190	INV-2026-1176	CS-BOOT-9	Chemical Resistant Steel Toe Shoes S3	NOS	6403	2.00	2072.00	0.00	2072.00	18.00	745.92	4144.00		2026-10-24 09:37:40.208259+05:30
373	191	INV-2026-1177	EX-LED-BAT	Emergency LED Exit Light 3h Backup	NOS	9405	2.00	1298.00	0.00	1298.00	18.00	467.28	2596.00		2026-10-24 09:37:40.210553+05:30
374	192	INV-2026-1178	FW-GW-10G	10Gbps Enterprise Next-Gen Firewall Gateway	NOS	8517	7.00	94500.00	0.00	94500.00	18.00	119070.00	661500.00		2026-10-24 09:37:40.212293+05:30
375	192	INV-2026-1178	EX-LED-BAT	Emergency LED Exit Light 3h Backup	NOS	9405	8.00	1298.00	0.00	1298.00	18.00	1869.12	10384.00		2026-10-24 09:37:40.212695+05:30
376	192	INV-2026-1178	SP-HDR-68	Pendant Sprinkler Head 68°C Red Bulb	NOS	8424	4.00	767.00	0.00	767.00	18.00	552.24	3068.00		2026-10-24 09:37:40.213034+05:30
377	193	INV-2026-1179	EX-LED-BAT	Emergency LED Exit Light 3h Backup	NOS	9405	6.00	1298.00	0.00	1298.00	18.00	1401.84	7788.00		2026-10-24 09:37:40.214318+05:30
378	193	INV-2026-1179	HR-SWV-30	Swinging Hose Reel Drum 30m with Nozzle	NOS	8424	2.00	7316.00	0.00	7316.00	18.00	2633.76	14632.00		2026-10-24 09:37:40.21482+05:30
379	194	INV-2026-1180	RACK-PDU-16	Smart Metered Rack PDU 16A 230V 24 Outlets	NOS	8537	2.00	18500.00	0.00	18500.00	18.00	6660.00	37000.00		2026-10-24 09:37:40.217496+05:30
380	194	INV-2026-1180	HT-GLV-500	500°C Heat Resistant Aluminized Gloves	NOS	6116	4.00	1848.00	0.00	1848.00	18.00	1330.56	7392.00		2026-10-24 09:37:40.218209+05:30
381	194	INV-2026-1180	SRV-RCK-42	42U Server Rack Closed Smart Cooling	NOS	8537	5.00	48500.00	0.00	48500.00	18.00	43650.00	242500.00		2026-10-24 09:37:40.218889+05:30
382	195	INV-2026-1181	FA-KIT1	First Aid Kit Industrial	NOS	3006	7.00	952.00	0.00	952.00	18.00	1199.52	6664.00		2026-10-24 09:37:40.221702+05:30
383	196	INV-2026-1182	SP-HDR-68	Pendant Sprinkler Head 68°C Red Bulb	NOS	8424	7.00	767.00	0.00	767.00	18.00	966.42	5369.00		2026-10-24 09:37:40.223634+05:30
384	196	INV-2026-1182	HT-GLV-500	500°C Heat Resistant Aluminized Gloves	NOS	6116	6.00	1848.00	0.00	1848.00	18.00	1995.84	11088.00		2026-10-24 09:37:40.22443+05:30
385	196	INV-2026-1182	ESD-MAT-01	Anti-Static ESD Grounding Mat 2x1m	NOS	3926	7.00	2450.00	0.00	2450.00	18.00	3087.00	17150.00		2026-10-24 09:37:40.225507+05:30
386	197	INV-2026-1183	HAZ-TYP3	Tychem 6000 Hazmat Liquid Suit	NOS	6210	2.00	7168.00	0.00	7168.00	18.00	2580.48	14336.00		2026-10-24 09:37:40.228301+05:30
387	197	INV-2026-1183	EX-LED-BAT	Emergency LED Exit Light 3h Backup	NOS	9405	6.00	1298.00	0.00	1298.00	18.00	1401.84	7788.00		2026-10-24 09:37:40.228905+05:30
388	198	INV-2026-1184	HAZ-TYP3	Tychem 6000 Hazmat Liquid Suit	NOS	6210	3.00	7168.00	0.00	7168.00	18.00	3870.72	21504.00		2026-10-24 09:37:40.231177+05:30
389	198	INV-2026-1184	LSR-SFT-GLS	Optical Fiber Laser Safety Protective Goggles	NOS	9004	3.00	5800.00	0.00	5800.00	18.00	3132.00	17400.00		2026-10-24 09:37:40.231809+05:30
390	199	INV-2026-1185	SM-DET1	Smoke Detector Photoelectric	NOS	8531	6.00	1416.00	0.00	1416.00	18.00	1529.28	8496.00		2026-10-24 09:37:40.233694+05:30
391	199	INV-2026-1185	EX-LED-BAT	Emergency LED Exit Light 3h Backup	NOS	9405	2.00	1298.00	0.00	1298.00	18.00	467.28	2596.00		2026-10-24 09:37:40.234187+05:30
392	200	INV-2026-1186	CS-BOOT-9	Chemical Resistant Steel Toe Shoes S3	NOS	6403	7.00	2072.00	0.00	2072.00	18.00	2610.72	14504.00		2026-10-24 09:37:40.238051+05:30
393	201	INV-2026-1187	EX-LED-BAT	Emergency LED Exit Light 3h Backup	NOS	9405	7.00	1298.00	0.00	1298.00	18.00	1635.48	9086.00		2026-10-24 09:37:40.240533+05:30
394	201	INV-2026-1187	SG-CL01	Safety Goggles Clear Lens	NOS	9004	2.00	171.10	0.00	171.10	18.00	61.60	342.20		2026-10-24 09:37:40.241273+05:30
395	201	INV-2026-1187	EX-LED-BAT	Emergency LED Exit Light 3h Backup	NOS	9405	5.00	1298.00	0.00	1298.00	18.00	1168.20	6490.00		2026-10-24 09:37:40.241745+05:30
396	202	INV-2026-1188	FE-ABC-4	ABC Dry Powder Fire Ext. 4kg	NOS	8424	6.00	1321.60	0.00	1321.60	18.00	1427.33	7929.60		2026-10-24 09:37:40.244217+05:30
397	202	INV-2026-1188	RACK-PDU-16	Smart Metered Rack PDU 16A 230V 24 Outlets	NOS	8537	5.00	18500.00	0.00	18500.00	18.00	16650.00	92500.00		2026-10-24 09:37:40.245722+05:30
398	202	INV-2026-1188	HR-SWV-30	Swinging Hose Reel Drum 30m with Nozzle	NOS	8424	6.00	7316.00	0.00	7316.00	18.00	7901.28	43896.00		2026-10-24 09:37:40.246575+05:30
399	203	INV-2026-1189	FE-ABC-4	ABC Dry Powder Fire Ext. 4kg	NOS	8424	5.00	1321.60	0.00	1321.60	18.00	1189.44	6608.00		2026-10-24 09:37:40.249065+05:30
400	203	INV-2026-1189	FR-SUT5	Fire Retardant Suit Type 5	NOS	6211	6.00	5040.00	0.00	5040.00	18.00	5443.20	30240.00		2026-10-24 09:37:40.249641+05:30
401	204	INV-2026-1190	CS-BOOT-9	Chemical Resistant Steel Toe Shoes S3	NOS	6403	1.00	2072.00	0.00	2072.00	18.00	372.96	2072.00		2026-10-24 09:37:40.25175+05:30
402	205	INV-2026-1191	GM-FFP3	Full Face Chemical Gas Mask FFP3	NOS	9020	1.00	3363.00	0.00	3363.00	18.00	605.34	3363.00		2026-10-24 09:37:40.254772+05:30
403	205	INV-2026-1191	SH-M201	Safety Helmet M-201 ISI	NOS	6506	2.00	336.30	0.00	336.30	18.00	121.07	672.60		2026-10-24 09:37:40.255364+05:30
404	205	INV-2026-1191	ESD-MAT-01	Anti-Static ESD Grounding Mat 2x1m	NOS	3926	7.00	2450.00	0.00	2450.00	18.00	3087.00	17150.00		2026-10-24 09:37:40.255947+05:30
405	206	INV-2026-1192	FE-ABC-4	ABC Dry Powder Fire Ext. 4kg	NOS	8424	8.00	1321.60	0.00	1321.60	18.00	1903.10	10572.80		2026-10-24 09:37:40.258694+05:30
406	206	INV-2026-1192	SH-M201	Safety Helmet M-201 ISI	NOS	6506	4.00	336.30	0.00	336.30	18.00	242.14	1345.20		2026-10-24 09:37:40.25946+05:30
407	206	INV-2026-1192	HR-SWV-30	Swinging Hose Reel Drum 30m with Nozzle	NOS	8424	1.00	7316.00	0.00	7316.00	18.00	1316.88	7316.00		2026-10-24 09:37:40.260073+05:30
408	207	INV-2026-1193	FE-ABC-4	ABC Dry Powder Fire Ext. 4kg	NOS	8424	8.00	1321.60	0.00	1321.60	18.00	1903.10	10572.80		2026-10-24 09:37:40.26251+05:30
409	207	INV-2026-1193	FE-CO2-2	CO2 Fire Extinguisher 2kg	NOS	8424	3.00	2891.00	0.00	2891.00	18.00	1561.14	8673.00		2026-10-24 09:37:40.266305+05:30
410	207	INV-2026-1193	SM-DET1	Smoke Detector Photoelectric	NOS	8531	6.00	1416.00	0.00	1416.00	18.00	1529.28	8496.00		2026-10-24 09:37:40.267199+05:30
411	208	INV-2026-1194	FW-GW-10G	10Gbps Enterprise Next-Gen Firewall Gateway	NOS	8517	8.00	94500.00	0.00	94500.00	18.00	136080.00	756000.00		2026-10-24 09:37:40.269167+05:30
412	208	INV-2026-1194	EX-LED-BAT	Emergency LED Exit Light 3h Backup	NOS	9405	4.00	1298.00	0.00	1298.00	18.00	934.56	5192.00		2026-10-24 09:37:40.269933+05:30
413	209	INV-2026-1195	SP-HDR-68	Pendant Sprinkler Head 68°C Red Bulb	NOS	8424	6.00	767.00	0.00	767.00	18.00	828.36	4602.00		2026-10-24 09:37:40.27276+05:30
414	210	INV-2026-1196	HT-GLV-500	500°C Heat Resistant Aluminized Gloves	NOS	6116	8.00	1848.00	0.00	1848.00	18.00	2661.12	14784.00		2026-10-24 09:37:40.27567+05:30
415	211	INV-2026-1197	HT-GLV-500	500°C Heat Resistant Aluminized Gloves	NOS	6116	5.00	1848.00	0.00	1848.00	18.00	1663.20	9240.00		2026-10-24 09:37:40.277665+05:30
416	211	INV-2026-1197	FW-GW-10G	10Gbps Enterprise Next-Gen Firewall Gateway	NOS	8517	4.00	94500.00	0.00	94500.00	18.00	68040.00	378000.00		2026-10-24 09:37:40.278261+05:30
417	211	INV-2026-1197	UPS-3KVA-ON	3kVA Online UPS Pure Sine Wave 230V	NOS	8504	7.00	38200.00	0.00	38200.00	18.00	48132.00	267400.00		2026-10-24 09:37:40.278979+05:30
418	212	INV-2026-1198	RACK-PDU-16	Smart Metered Rack PDU 16A 230V 24 Outlets	NOS	8537	4.00	18500.00	0.00	18500.00	18.00	13320.00	74000.00		2026-10-24 09:37:40.281784+05:30
419	212	INV-2026-1198	CAT6A-100M	10Gbps Shielded Cat6A Cable Roll 100m	NOS	8544	3.00	4950.00	0.00	4950.00	18.00	2673.00	14850.00		2026-10-24 09:37:40.282321+05:30
420	212	INV-2026-1198	UPS-3KVA-ON	3kVA Online UPS Pure Sine Wave 230V	NOS	8504	6.00	38200.00	0.00	38200.00	18.00	41256.00	229200.00		2026-10-24 09:37:40.28285+05:30
421	213	INV-2026-1199	UPS-3KVA-ON	3kVA Online UPS Pure Sine Wave 230V	NOS	8504	8.00	38200.00	0.00	38200.00	18.00	55008.00	305600.00		2026-10-24 09:37:40.284831+05:30
422	214	INV-2026-1200	UPS-3KVA-ON	3kVA Online UPS Pure Sine Wave 230V	NOS	8504	6.00	38200.00	0.00	38200.00	18.00	41256.00	229200.00		2026-10-24 09:37:40.287291+05:30
423	214	INV-2026-1200	CF-EXT-50	Chemical Foam Fire Ext. 50L Trolley	NOS	8424	4.00	9912.00	0.00	9912.00	18.00	7136.64	39648.00		2026-10-24 09:37:40.288021+05:30
424	214	INV-2026-1200	CS-BOOT-9	Chemical Resistant Steel Toe Shoes S3	NOS	6403	4.00	2072.00	0.00	2072.00	18.00	1491.84	8288.00		2026-10-24 09:37:40.288783+05:30
425	215	INV-2026-1201	CAT6A-100M	10Gbps Shielded Cat6A Cable Roll 100m	NOS	8544	6.00	4950.00	0.00	4950.00	18.00	5346.00	29700.00		2026-10-24 09:37:40.291695+05:30
426	216	INV-2026-1202	SRV-RCK-42	42U Server Rack Closed Smart Cooling	NOS	8537	4.00	48500.00	0.00	48500.00	18.00	34920.00	194000.00		2026-10-24 09:37:40.293688+05:30
427	216	INV-2026-1202	EX-LED-BAT	Emergency LED Exit Light 3h Backup	NOS	9405	4.00	1298.00	0.00	1298.00	18.00	934.56	5192.00		2026-10-24 09:37:40.294263+05:30
428	217	INV-2026-1203	CAT6A-100M	10Gbps Shielded Cat6A Cable Roll 100m	NOS	8544	7.00	4950.00	0.00	4950.00	18.00	6237.00	34650.00		2026-10-24 09:37:40.296135+05:30
429	218	INV-2026-1204	SG-CL01	Safety Goggles Clear Lens	NOS	9004	6.00	171.10	0.00	171.10	18.00	184.79	1026.60		2026-10-24 09:37:40.298697+05:30
430	218	INV-2026-1204	CAT6A-100M	10Gbps Shielded Cat6A Cable Roll 100m	NOS	8544	1.00	4950.00	0.00	4950.00	18.00	891.00	4950.00		2026-10-24 09:37:40.299281+05:30
431	219	INV-2026-1205	ESD-MAT-01	Anti-Static ESD Grounding Mat 2x1m	NOS	3926	8.00	2450.00	0.00	2450.00	18.00	3528.00	19600.00		2026-10-24 09:37:40.301587+05:30
432	219	INV-2026-1205	CS-BOOT-9	Chemical Resistant Steel Toe Shoes S3	NOS	6403	7.00	2072.00	0.00	2072.00	18.00	2610.72	14504.00		2026-10-24 09:37:40.302291+05:30
433	219	INV-2026-1205	HR-SWV-30	Swinging Hose Reel Drum 30m with Nozzle	NOS	8424	3.00	7316.00	0.00	7316.00	18.00	3950.64	21948.00		2026-10-24 09:37:40.302861+05:30
434	220	INV-2026-1206	FW-GW-10G	10Gbps Enterprise Next-Gen Firewall Gateway	NOS	8517	6.00	94500.00	0.00	94500.00	18.00	102060.00	567000.00		2026-10-24 09:37:40.304941+05:30
435	220	INV-2026-1206	HT-GLV-500	500°C Heat Resistant Aluminized Gloves	NOS	6116	6.00	1848.00	0.00	1848.00	18.00	1995.84	11088.00		2026-10-24 09:37:40.305395+05:30
436	221	INV-2026-1207	SG-CL01	Safety Goggles Clear Lens	NOS	9004	2.00	171.10	0.00	171.10	18.00	61.60	342.20		2026-10-24 09:37:40.307941+05:30
437	221	INV-2026-1207	FW-GW-10G	10Gbps Enterprise Next-Gen Firewall Gateway	NOS	8517	6.00	94500.00	0.00	94500.00	18.00	102060.00	567000.00		2026-10-24 09:37:40.308569+05:30
438	222	INV-2026-1208	HR-SWV-30	Swinging Hose Reel Drum 30m with Nozzle	NOS	8424	1.00	7316.00	0.00	7316.00	18.00	1316.88	7316.00		2026-10-24 09:37:40.310367+05:30
439	223	INV-2026-1209	CF-EXT-50	Chemical Foam Fire Ext. 50L Trolley	NOS	8424	5.00	9912.00	0.00	9912.00	18.00	8920.80	49560.00		2026-10-24 09:37:40.312026+05:30
440	224	INV-2026-1210	RACK-PDU-16	Smart Metered Rack PDU 16A 230V 24 Outlets	NOS	8537	3.00	18500.00	0.00	18500.00	18.00	9990.00	55500.00		2026-10-24 09:37:40.314426+05:30
441	225	INV-2026-1211	SP-HDR-68	Pendant Sprinkler Head 68°C Red Bulb	NOS	8424	6.00	767.00	0.00	767.00	18.00	828.36	4602.00		2026-10-24 09:37:40.317334+05:30
442	226	INV-2026-1212	SP-HDR-68	Pendant Sprinkler Head 68°C Red Bulb	NOS	8424	8.00	767.00	0.00	767.00	18.00	1104.48	6136.00		2026-10-24 09:37:40.319273+05:30
443	226	INV-2026-1212	CF-EXT-50	Chemical Foam Fire Ext. 50L Trolley	NOS	8424	5.00	9912.00	0.00	9912.00	18.00	8920.80	49560.00		2026-10-24 09:37:40.319865+05:30
444	226	INV-2026-1212	SRV-RCK-42	42U Server Rack Closed Smart Cooling	NOS	8537	6.00	48500.00	0.00	48500.00	18.00	52380.00	291000.00		2026-10-24 09:37:40.320498+05:30
445	227	INV-2026-1213	FW-GW-10G	10Gbps Enterprise Next-Gen Firewall Gateway	NOS	8517	5.00	94500.00	0.00	94500.00	18.00	85050.00	472500.00		2026-10-24 09:37:40.323379+05:30
446	227	INV-2026-1213	CS-BOOT-9	Chemical Resistant Steel Toe Shoes S3	NOS	6403	5.00	2072.00	0.00	2072.00	18.00	1864.80	10360.00		2026-10-24 09:37:40.323919+05:30
447	227	INV-2026-1213	FR-SUT5	Fire Retardant Suit Type 5	NOS	6211	4.00	5040.00	0.00	5040.00	18.00	3628.80	20160.00		2026-10-24 09:37:40.324401+05:30
448	228	INV-2026-1214	FB-HVY-2	Heavy Duty Fire Blanket 2x2m Fiberglass	NOS	7019	6.00	1475.00	0.00	1475.00	18.00	1593.00	8850.00		2026-10-24 09:37:40.326297+05:30
449	228	INV-2026-1214	HR-SWV-30	Swinging Hose Reel Drum 30m with Nozzle	NOS	8424	5.00	7316.00	0.00	7316.00	18.00	6584.40	36580.00		2026-10-24 09:37:40.326867+05:30
450	228	INV-2026-1214	FR-SUT5	Fire Retardant Suit Type 5	NOS	6211	1.00	5040.00	0.00	5040.00	18.00	907.20	5040.00		2026-10-24 09:37:40.327554+05:30
451	229	INV-2026-1215	GM-FFP3	Full Face Chemical Gas Mask FFP3	NOS	9020	3.00	3363.00	0.00	3363.00	18.00	1816.02	10089.00		2026-10-24 09:37:40.330234+05:30
452	230	INV-2026-1216	FB-HVY-2	Heavy Duty Fire Blanket 2x2m Fiberglass	NOS	7019	3.00	1475.00	0.00	1475.00	18.00	796.50	4425.00		2026-10-24 09:37:40.333543+05:30
453	230	INV-2026-1216	HT-GLV-500	500°C Heat Resistant Aluminized Gloves	NOS	6116	1.00	1848.00	0.00	1848.00	18.00	332.64	1848.00		2026-10-24 09:37:40.334105+05:30
454	231	INV-2026-1217	SRV-RCK-42	42U Server Rack Closed Smart Cooling	NOS	8537	4.00	48500.00	0.00	48500.00	18.00	34920.00	194000.00		2026-10-24 09:37:40.33627+05:30
455	231	INV-2026-1217	SM-DET1	Smoke Detector Photoelectric	NOS	8531	5.00	1416.00	0.00	1416.00	18.00	1274.40	7080.00		2026-10-24 09:37:40.337005+05:30
456	232	INV-2026-1218	CS-BOOT-9	Chemical Resistant Steel Toe Shoes S3	NOS	6403	1.00	2072.00	0.00	2072.00	18.00	372.96	2072.00		2026-10-24 09:37:40.338819+05:30
457	232	INV-2026-1218	FBR-SFP-10	10G SFP+ Optical Transceiver Module 10km	NOS	8517	5.00	3650.00	0.00	3650.00	18.00	3285.00	18250.00		2026-10-24 09:37:40.339315+05:30
458	232	INV-2026-1218	FE-ABC-4	ABC Dry Powder Fire Ext. 4kg	NOS	8424	6.00	1321.60	0.00	1321.60	18.00	1427.33	7929.60		2026-10-24 09:37:40.339826+05:30
459	233	INV-2026-1219	HT-GLV-500	500°C Heat Resistant Aluminized Gloves	NOS	6116	8.00	1848.00	0.00	1848.00	18.00	2661.12	14784.00		2026-10-24 09:37:40.342674+05:30
460	234	INV-2026-1220	HR-SWV-30	Swinging Hose Reel Drum 30m with Nozzle	NOS	8424	8.00	7316.00	0.00	7316.00	18.00	10535.04	58528.00		2026-10-24 09:37:40.344715+05:30
461	235	INV-2026-1221	EX-LED-BAT	Emergency LED Exit Light 3h Backup	NOS	9405	8.00	1298.00	0.00	1298.00	18.00	1869.12	10384.00		2026-10-24 09:37:40.346783+05:30
462	235	INV-2026-1221	HAZ-TYP3	Tychem 6000 Hazmat Liquid Suit	NOS	6210	4.00	7168.00	0.00	7168.00	18.00	5160.96	28672.00		2026-10-24 09:37:40.34732+05:30
463	235	INV-2026-1221	FBR-SFP-10	10G SFP+ Optical Transceiver Module 10km	NOS	8517	1.00	3650.00	0.00	3650.00	18.00	657.00	3650.00		2026-10-24 09:37:40.347842+05:30
464	236	INV-2026-1222	SH-M201	Safety Helmet M-201 ISI	NOS	6506	4.00	336.30	0.00	336.30	18.00	242.14	1345.20		2026-10-24 09:37:40.350865+05:30
465	236	INV-2026-1222	FR-SUT5	Fire Retardant Suit Type 5	NOS	6211	3.00	5040.00	0.00	5040.00	18.00	2721.60	15120.00		2026-10-24 09:37:40.351564+05:30
466	237	INV-2026-1223	FE-ABC-4	ABC Dry Powder Fire Ext. 4kg	NOS	8424	6.00	1321.60	0.00	1321.60	18.00	1427.33	7929.60		2026-10-24 09:37:40.352989+05:30
467	237	INV-2026-1223	FW-GW-10G	10Gbps Enterprise Next-Gen Firewall Gateway	NOS	8517	4.00	94500.00	0.00	94500.00	18.00	68040.00	378000.00		2026-10-24 09:37:40.354222+05:30
468	237	INV-2026-1223	FE-CO2-2	CO2 Fire Extinguisher 2kg	NOS	8424	5.00	2891.00	0.00	2891.00	18.00	2601.90	14455.00		2026-10-24 09:37:40.354782+05:30
469	238	INV-2026-1224	GM-FFP3	Full Face Chemical Gas Mask FFP3	NOS	9020	8.00	3363.00	0.00	3363.00	18.00	4842.72	26904.00		2026-10-24 09:37:40.356983+05:30
470	238	INV-2026-1224	HR-SWV-30	Swinging Hose Reel Drum 30m with Nozzle	NOS	8424	3.00	7316.00	0.00	7316.00	18.00	3950.64	21948.00		2026-10-24 09:37:40.35766+05:30
471	238	INV-2026-1224	FB-HVY-2	Heavy Duty Fire Blanket 2x2m Fiberglass	NOS	7019	1.00	1475.00	0.00	1475.00	18.00	265.50	1475.00		2026-10-24 09:37:40.358235+05:30
472	239	INV-2026-1225	HR-SWV-30	Swinging Hose Reel Drum 30m with Nozzle	NOS	8424	5.00	7316.00	0.00	7316.00	18.00	6584.40	36580.00		2026-10-24 09:37:40.360479+05:30
473	239	INV-2026-1225	HT-GLV-500	500°C Heat Resistant Aluminized Gloves	NOS	6116	6.00	1848.00	0.00	1848.00	18.00	1995.84	11088.00		2026-10-24 09:37:40.360954+05:30
474	240	INV-2026-1226	LSR-SFT-GLS	Optical Fiber Laser Safety Protective Goggles	NOS	9004	1.00	5800.00	0.00	5800.00	18.00	1044.00	5800.00		2026-10-24 09:37:40.363581+05:30
475	240	INV-2026-1226	SM-DET1	Smoke Detector Photoelectric	NOS	8531	3.00	1416.00	0.00	1416.00	18.00	764.64	4248.00		2026-10-24 09:37:40.3643+05:30
476	240	INV-2026-1226	SG-CL01	Safety Goggles Clear Lens	NOS	9004	7.00	171.10	0.00	171.10	18.00	215.59	1197.70		2026-10-24 09:37:40.365077+05:30
477	241	INV-2026-1227	FA-KIT1	First Aid Kit Industrial	NOS	3006	6.00	952.00	0.00	952.00	18.00	1028.16	5712.00		2026-10-24 09:37:40.367034+05:30
478	241	INV-2026-1227	SP-HDR-68	Pendant Sprinkler Head 68°C Red Bulb	NOS	8424	7.00	767.00	0.00	767.00	18.00	966.42	5369.00		2026-10-24 09:37:40.367652+05:30
479	242	INV-2026-1228	CF-EXT-50	Chemical Foam Fire Ext. 50L Trolley	NOS	8424	5.00	9912.00	0.00	9912.00	18.00	8920.80	49560.00		2026-10-24 09:37:40.370242+05:30
480	242	INV-2026-1228	FA-KIT1	First Aid Kit Industrial	NOS	3006	1.00	952.00	0.00	952.00	18.00	171.36	952.00		2026-10-24 09:37:40.371123+05:30
481	243	INV-2026-1229	HT-GLV-500	500°C Heat Resistant Aluminized Gloves	NOS	6116	2.00	1848.00	0.00	1848.00	18.00	665.28	3696.00		2026-10-24 09:37:40.372908+05:30
482	244	INV-2026-1230	FE-CO2-2	CO2 Fire Extinguisher 2kg	NOS	8424	1.00	2891.00	0.00	2891.00	18.00	520.38	2891.00		2026-10-24 09:37:40.375926+05:30
483	245	INV-2026-1231	HAZ-TYP3	Tychem 6000 Hazmat Liquid Suit	NOS	6210	6.00	7168.00	0.00	7168.00	18.00	7741.44	43008.00		2026-10-24 09:37:40.379454+05:30
484	245	INV-2026-1231	GM-FFP3	Full Face Chemical Gas Mask FFP3	NOS	9020	3.00	3363.00	0.00	3363.00	18.00	1816.02	10089.00		2026-10-24 09:37:40.380164+05:30
485	246	INV-2026-1232	SG-CL01	Safety Goggles Clear Lens	NOS	9004	6.00	171.10	0.00	171.10	18.00	184.79	1026.60		2026-10-24 09:37:40.381788+05:30
486	246	INV-2026-1232	CF-EXT-50	Chemical Foam Fire Ext. 50L Trolley	NOS	8424	2.00	9912.00	0.00	9912.00	18.00	3568.32	19824.00		2026-10-24 09:37:40.382235+05:30
487	246	INV-2026-1232	HT-GLV-500	500°C Heat Resistant Aluminized Gloves	NOS	6116	8.00	1848.00	0.00	1848.00	18.00	2661.12	14784.00		2026-10-24 09:37:40.382728+05:30
488	247	INV-2026-1233	HAZ-TYP3	Tychem 6000 Hazmat Liquid Suit	NOS	6210	6.00	7168.00	0.00	7168.00	18.00	7741.44	43008.00		2026-10-24 09:37:40.385144+05:30
489	247	INV-2026-1233	FR-SUT5	Fire Retardant Suit Type 5	NOS	6211	1.00	5040.00	0.00	5040.00	18.00	907.20	5040.00		2026-10-24 09:37:40.38577+05:30
490	248	INV-2026-1234	FB-HVY-2	Heavy Duty Fire Blanket 2x2m Fiberglass	NOS	7019	5.00	1475.00	0.00	1475.00	18.00	1327.50	7375.00		2026-10-24 09:37:40.387685+05:30
491	249	INV-2026-1235	FE-CO2-2	CO2 Fire Extinguisher 2kg	NOS	8424	5.00	2891.00	0.00	2891.00	18.00	2601.90	14455.00		2026-10-24 09:37:40.388747+05:30
492	249	INV-2026-1235	SRV-RCK-42	42U Server Rack Closed Smart Cooling	NOS	8537	1.00	48500.00	0.00	48500.00	18.00	8730.00	48500.00		2026-10-24 09:37:40.3891+05:30
493	250	INV-2026-1236	FR-SUT5	Fire Retardant Suit Type 5	NOS	6211	7.00	5040.00	0.00	5040.00	18.00	6350.40	35280.00		2026-10-24 09:37:40.391376+05:30
494	250	INV-2026-1236	SH-M201	Safety Helmet M-201 ISI	NOS	6506	8.00	336.30	0.00	336.30	18.00	484.27	2690.40		2026-10-24 09:37:40.39189+05:30
495	250	INV-2026-1236	FA-KIT1	First Aid Kit Industrial	NOS	3006	2.00	952.00	0.00	952.00	18.00	342.72	1904.00		2026-10-24 09:37:40.392379+05:30
496	251	INV-2026-1237	FW-GW-10G	10Gbps Enterprise Next-Gen Firewall Gateway	NOS	8517	6.00	94500.00	0.00	94500.00	18.00	102060.00	567000.00		2026-10-24 09:37:40.39431+05:30
497	252	INV-2026-1238	FB-HVY-2	Heavy Duty Fire Blanket 2x2m Fiberglass	NOS	7019	5.00	1475.00	0.00	1475.00	18.00	1327.50	7375.00		2026-10-24 09:37:40.395563+05:30
498	252	INV-2026-1238	EX-LED-BAT	Emergency LED Exit Light 3h Backup	NOS	9405	7.00	1298.00	0.00	1298.00	18.00	1635.48	9086.00		2026-10-24 09:37:40.395891+05:30
499	252	INV-2026-1238	GM-FFP3	Full Face Chemical Gas Mask FFP3	NOS	9020	3.00	3363.00	0.00	3363.00	18.00	1816.02	10089.00		2026-10-24 09:37:40.396271+05:30
500	253	INV-2026-1239	HR-SWV-30	Swinging Hose Reel Drum 30m with Nozzle	NOS	8424	8.00	7316.00	0.00	7316.00	18.00	10535.04	58528.00		2026-10-24 09:37:40.39803+05:30
501	253	INV-2026-1239	HR-SWV-30	Swinging Hose Reel Drum 30m with Nozzle	NOS	8424	1.00	7316.00	0.00	7316.00	18.00	1316.88	7316.00		2026-10-24 09:37:40.398537+05:30
502	254	INV-2026-1240	EX-LED-BAT	Emergency LED Exit Light 3h Backup	NOS	9405	8.00	1298.00	0.00	1298.00	18.00	1869.12	10384.00		2026-10-24 09:37:40.400568+05:30
503	254	INV-2026-1240	HR-SWV-30	Swinging Hose Reel Drum 30m with Nozzle	NOS	8424	8.00	7316.00	0.00	7316.00	18.00	10535.04	58528.00		2026-10-24 09:37:40.400928+05:30
504	254	INV-2026-1240	FR-SUT5	Fire Retardant Suit Type 5	NOS	6211	5.00	5040.00	0.00	5040.00	18.00	4536.00	25200.00		2026-10-24 09:37:40.401234+05:30
505	255	INV-2026-1241	FR-SUT5	Fire Retardant Suit Type 5	NOS	6211	7.00	5040.00	0.00	5040.00	18.00	6350.40	35280.00		2026-10-24 09:37:40.403+05:30
506	255	INV-2026-1241	FR-SUT5	Fire Retardant Suit Type 5	NOS	6211	4.00	5040.00	0.00	5040.00	18.00	3628.80	20160.00		2026-10-24 09:37:40.403457+05:30
507	255	INV-2026-1241	CF-EXT-50	Chemical Foam Fire Ext. 50L Trolley	NOS	8424	2.00	9912.00	0.00	9912.00	18.00	3568.32	19824.00		2026-10-24 09:37:40.403902+05:30
508	256	INV-2026-1242	EX-LED-BAT	Emergency LED Exit Light 3h Backup	NOS	9405	7.00	1298.00	0.00	1298.00	18.00	1635.48	9086.00		2026-10-24 09:37:40.405123+05:30
509	256	INV-2026-1242	FB-HVY-2	Heavy Duty Fire Blanket 2x2m Fiberglass	NOS	7019	6.00	1475.00	0.00	1475.00	18.00	1593.00	8850.00		2026-10-24 09:37:40.405667+05:30
510	256	INV-2026-1242	EX-LED-BAT	Emergency LED Exit Light 3h Backup	NOS	9405	6.00	1298.00	0.00	1298.00	18.00	1401.84	7788.00		2026-10-24 09:37:40.406254+05:30
511	257	INV-2026-1243	SRV-RCK-42	42U Server Rack Closed Smart Cooling	NOS	8537	4.00	48500.00	0.00	48500.00	18.00	34920.00	194000.00		2026-10-24 09:37:40.408141+05:30
512	257	INV-2026-1243	HR-SWV-30	Swinging Hose Reel Drum 30m with Nozzle	NOS	8424	6.00	7316.00	0.00	7316.00	18.00	7901.28	43896.00		2026-10-24 09:37:40.408522+05:30
513	258	INV-2026-1244	CS-BOOT-9	Chemical Resistant Steel Toe Shoes S3	NOS	6403	1.00	2072.00	0.00	2072.00	18.00	372.96	2072.00		2026-10-24 09:37:40.409583+05:30
514	258	INV-2026-1244	UPS-3KVA-ON	3kVA Online UPS Pure Sine Wave 230V	NOS	8504	5.00	38200.00	0.00	38200.00	18.00	34380.00	191000.00		2026-10-24 09:37:40.409921+05:30
515	258	INV-2026-1244	HT-GLV-500	500°C Heat Resistant Aluminized Gloves	NOS	6116	3.00	1848.00	0.00	1848.00	18.00	997.92	5544.00		2026-10-24 09:37:40.410253+05:30
516	259	INV-2026-1245	FR-SUT5	Fire Retardant Suit Type 5	NOS	6211	1.00	5040.00	0.00	5040.00	18.00	907.20	5040.00		2026-10-24 09:37:40.411937+05:30
517	259	INV-2026-1245	EX-LED-BAT	Emergency LED Exit Light 3h Backup	NOS	9405	1.00	1298.00	0.00	1298.00	18.00	233.64	1298.00		2026-10-24 09:37:40.412504+05:30
518	259	INV-2026-1245	SP-HDR-68	Pendant Sprinkler Head 68°C Red Bulb	NOS	8424	7.00	767.00	0.00	767.00	18.00	966.42	5369.00		2026-10-24 09:37:40.413141+05:30
519	260	INV-2026-1246	CAT6A-100M	10Gbps Shielded Cat6A Cable Roll 100m	NOS	8544	4.00	4950.00	0.00	4950.00	18.00	3564.00	19800.00		2026-10-24 09:37:40.414962+05:30
520	261	INV-2026-1247	GM-FFP3	Full Face Chemical Gas Mask FFP3	NOS	9020	2.00	3363.00	0.00	3363.00	18.00	1210.68	6726.00		2026-10-24 09:37:40.416071+05:30
521	261	INV-2026-1247	HR-SWV-30	Swinging Hose Reel Drum 30m with Nozzle	NOS	8424	3.00	7316.00	0.00	7316.00	18.00	3950.64	21948.00		2026-10-24 09:37:40.416365+05:30
522	261	INV-2026-1247	SM-DET1	Smoke Detector Photoelectric	NOS	8531	1.00	1416.00	0.00	1416.00	18.00	254.88	1416.00		2026-10-24 09:37:40.416724+05:30
523	262	INV-2026-1248	CF-EXT-50	Chemical Foam Fire Ext. 50L Trolley	NOS	8424	8.00	9912.00	0.00	9912.00	18.00	14273.28	79296.00		2026-10-24 09:37:40.418776+05:30
524	263	INV-2026-1249	ESD-MAT-01	Anti-Static ESD Grounding Mat 2x1m	NOS	3926	1.00	2450.00	0.00	2450.00	18.00	441.00	2450.00		2026-10-24 09:37:40.420658+05:30
525	263	INV-2026-1249	FR-SUT5	Fire Retardant Suit Type 5	NOS	6211	2.00	5040.00	0.00	5040.00	18.00	1814.40	10080.00		2026-10-24 09:37:40.421105+05:30
526	263	INV-2026-1249	ESD-MAT-01	Anti-Static ESD Grounding Mat 2x1m	NOS	3926	5.00	2450.00	0.00	2450.00	18.00	2205.00	12250.00		2026-10-24 09:37:40.421486+05:30
527	264	INV-2026-1250	SP-HDR-68	Pendant Sprinkler Head 68°C Red Bulb	NOS	8424	4.00	767.00	0.00	767.00	18.00	552.24	3068.00		2026-10-24 09:37:40.422643+05:30
528	265	INV-2026-1251	EX-LED-BAT	Emergency LED Exit Light 3h Backup	NOS	9405	5.00	1298.00	0.00	1298.00	18.00	1168.20	6490.00		2026-10-24 09:37:40.424203+05:30
529	265	INV-2026-1251	EX-LED-BAT	Emergency LED Exit Light 3h Backup	NOS	9405	7.00	1298.00	0.00	1298.00	18.00	1635.48	9086.00		2026-10-24 09:37:40.424717+05:30
530	266	INV-2026-1252	SM-DET1	Smoke Detector Photoelectric	NOS	8531	3.00	1416.00	0.00	1416.00	18.00	764.64	4248.00		2026-10-24 09:37:40.426879+05:30
531	266	INV-2026-1252	HT-GLV-500	500°C Heat Resistant Aluminized Gloves	NOS	6116	2.00	1848.00	0.00	1848.00	18.00	665.28	3696.00		2026-10-24 09:37:40.427345+05:30
532	266	INV-2026-1252	HR-SWV-30	Swinging Hose Reel Drum 30m with Nozzle	NOS	8424	6.00	7316.00	0.00	7316.00	18.00	7901.28	43896.00		2026-10-24 09:37:40.427704+05:30
533	267	INV-2026-1253	FE-CO2-2	CO2 Fire Extinguisher 2kg	NOS	8424	4.00	2891.00	0.00	2891.00	18.00	2081.52	11564.00		2026-10-24 09:37:40.428998+05:30
534	268	INV-2026-1254	SP-HDR-68	Pendant Sprinkler Head 68°C Red Bulb	NOS	8424	1.00	767.00	0.00	767.00	18.00	138.06	767.00		2026-10-24 09:37:40.430023+05:30
535	268	INV-2026-1254	CF-EXT-50	Chemical Foam Fire Ext. 50L Trolley	NOS	8424	1.00	9912.00	0.00	9912.00	18.00	1784.16	9912.00		2026-10-24 09:37:40.430398+05:30
536	269	INV-2026-1255	FBR-SFP-10	10G SFP+ Optical Transceiver Module 10km	NOS	8517	8.00	3650.00	0.00	3650.00	18.00	5256.00	29200.00		2026-10-24 09:37:40.432388+05:30
537	270	INV-2026-1256	FE-CO2-2	CO2 Fire Extinguisher 2kg	NOS	8424	1.00	2891.00	0.00	2891.00	18.00	520.38	2891.00		2026-10-24 09:37:40.434186+05:30
538	271	INV-2026-1257	SP-HDR-68	Pendant Sprinkler Head 68°C Red Bulb	NOS	8424	4.00	767.00	0.00	767.00	18.00	552.24	3068.00		2026-10-24 09:37:40.435269+05:30
539	271	INV-2026-1257	FR-SUT5	Fire Retardant Suit Type 5	NOS	6211	5.00	5040.00	0.00	5040.00	18.00	4536.00	25200.00		2026-10-24 09:37:40.435586+05:30
540	271	INV-2026-1257	HAZ-TYP3	Tychem 6000 Hazmat Liquid Suit	NOS	6210	5.00	7168.00	0.00	7168.00	18.00	6451.20	35840.00		2026-10-24 09:37:40.435889+05:30
541	272	INV-2026-1258	RACK-PDU-16	Smart Metered Rack PDU 16A 230V 24 Outlets	NOS	8537	4.00	18500.00	0.00	18500.00	18.00	13320.00	74000.00		2026-10-24 09:37:40.437818+05:30
542	272	INV-2026-1258	GM-FFP3	Full Face Chemical Gas Mask FFP3	NOS	9020	4.00	3363.00	0.00	3363.00	18.00	2421.36	13452.00		2026-10-24 09:37:40.43846+05:30
543	273	INV-2026-1259	FBR-SFP-10	10G SFP+ Optical Transceiver Module 10km	NOS	8517	4.00	3650.00	0.00	3650.00	18.00	2628.00	14600.00		2026-10-24 09:37:40.440035+05:30
544	274	INV-2026-1260	FW-GW-10G	10Gbps Enterprise Next-Gen Firewall Gateway	NOS	8517	6.00	94500.00	0.00	94500.00	18.00	102060.00	567000.00		2026-10-24 09:37:40.44134+05:30
545	275	INV-2026-1261	ESD-MAT-01	Anti-Static ESD Grounding Mat 2x1m	NOS	3926	5.00	2450.00	0.00	2450.00	18.00	2205.00	12250.00		2026-10-24 09:37:40.443708+05:30
546	275	INV-2026-1261	SM-DET1	Smoke Detector Photoelectric	NOS	8531	3.00	1416.00	0.00	1416.00	18.00	764.64	4248.00		2026-10-24 09:37:40.444184+05:30
547	276	INV-2026-1262	FE-CO2-2	CO2 Fire Extinguisher 2kg	NOS	8424	2.00	2891.00	0.00	2891.00	18.00	1040.76	5782.00		2026-10-24 09:37:40.445682+05:30
548	277	INV-2026-1263	EX-LED-BAT	Emergency LED Exit Light 3h Backup	NOS	9405	5.00	1298.00	0.00	1298.00	18.00	1168.20	6490.00		2026-10-24 09:37:40.447073+05:30
549	277	INV-2026-1263	GM-FFP3	Full Face Chemical Gas Mask FFP3	NOS	9020	1.00	3363.00	0.00	3363.00	18.00	605.34	3363.00		2026-10-24 09:37:40.447585+05:30
550	277	INV-2026-1263	SP-HDR-68	Pendant Sprinkler Head 68°C Red Bulb	NOS	8424	7.00	767.00	0.00	767.00	18.00	966.42	5369.00		2026-10-24 09:37:40.448104+05:30
551	278	INV-2026-1264	EX-LED-BAT	Emergency LED Exit Light 3h Backup	NOS	9405	7.00	1298.00	0.00	1298.00	18.00	1635.48	9086.00		2026-10-24 09:37:40.449488+05:30
552	278	INV-2026-1264	UPS-3KVA-ON	3kVA Online UPS Pure Sine Wave 230V	NOS	8504	5.00	38200.00	0.00	38200.00	18.00	34380.00	191000.00		2026-10-24 09:37:40.44982+05:30
553	278	INV-2026-1264	GM-FFP3	Full Face Chemical Gas Mask FFP3	NOS	9020	1.00	3363.00	0.00	3363.00	18.00	605.34	3363.00		2026-10-24 09:37:40.450106+05:30
554	279	INV-2026-1265	CF-EXT-50	Chemical Foam Fire Ext. 50L Trolley	NOS	8424	5.00	9912.00	0.00	9912.00	18.00	8920.80	49560.00		2026-10-24 09:37:40.451499+05:30
555	279	INV-2026-1265	FR-SUT5	Fire Retardant Suit Type 5	NOS	6211	3.00	5040.00	0.00	5040.00	18.00	2721.60	15120.00		2026-10-24 09:37:40.45199+05:30
556	279	INV-2026-1265	FW-GW-10G	10Gbps Enterprise Next-Gen Firewall Gateway	NOS	8517	1.00	94500.00	0.00	94500.00	18.00	17010.00	94500.00		2026-10-24 09:37:40.452487+05:30
557	280	INV-2026-1266	SP-HDR-68	Pendant Sprinkler Head 68°C Red Bulb	NOS	8424	5.00	767.00	0.00	767.00	18.00	690.30	3835.00		2026-10-24 09:37:40.454182+05:30
558	281	INV-2026-1267	SP-HDR-68	Pendant Sprinkler Head 68°C Red Bulb	NOS	8424	7.00	767.00	0.00	767.00	18.00	966.42	5369.00		2026-10-24 09:37:40.45559+05:30
559	281	INV-2026-1267	FE-ABC-4	ABC Dry Powder Fire Ext. 4kg	NOS	8424	2.00	1321.60	0.00	1321.60	18.00	475.78	2643.20		2026-10-24 09:37:40.455978+05:30
560	281	INV-2026-1267	CF-EXT-50	Chemical Foam Fire Ext. 50L Trolley	NOS	8424	8.00	9912.00	0.00	9912.00	18.00	14273.28	79296.00		2026-10-24 09:37:40.456307+05:30
561	282	INV-2026-1268	HAZ-TYP3	Tychem 6000 Hazmat Liquid Suit	NOS	6210	7.00	7168.00	0.00	7168.00	18.00	9031.68	50176.00		2026-10-24 09:37:40.457362+05:30
562	282	INV-2026-1268	SRV-RCK-42	42U Server Rack Closed Smart Cooling	NOS	8537	1.00	48500.00	0.00	48500.00	18.00	8730.00	48500.00		2026-10-24 09:37:40.457693+05:30
563	282	INV-2026-1268	FW-GW-10G	10Gbps Enterprise Next-Gen Firewall Gateway	NOS	8517	7.00	94500.00	0.00	94500.00	18.00	119070.00	661500.00		2026-10-24 09:37:40.457969+05:30
564	283	8	SG-CL01	Safety Goggles Clear Lens	NOS	9004	1.00	900.00	0.00	900.00	5.00	45.00	900.00		2026-10-24 22:55:05.151355+05:30
\.


--
-- TOC entry 5447 (class 0 OID 25558)
-- Dependencies: 224
-- Data for Name: invoices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invoices (id, invoice_no, branch_code, customer_uid, customer_name, contact_person, customer_phone, customer_email, customer_address, customer_gstin, invoice_date, due_date, followup_by, reference_no, revision_no, total_items, subtotal, total_tax, discount_amount, round_off, grand_total, payment_mode, status, quote_remark, terms_conditions, created_by, created_at, updated_at, company_id) FROM stdin;
15	INV-2026-1001	BRD-02		Adani Ports & Special Economic Zone		+91 98250 11223	adaniportsspecialeconomiczone@corp.in	Mundra Port SEZ, Kutch	24AAACA1234F1Z1	2026-05-02	\N	Admin		1	1	17346.00	3122.28	867.30	0.00	19600.98	Bank Transfer	Posted			Admin	2026-10-24 09:37:39.656916+05:30	2026-10-24 09:37:39.656916+05:30	comp_mann
1	1	AMD-01	OC-001	Rajkot Heavy Industries Ltd	Rajesh Patel	9825012345	purchase@rajkotind.com	Plot 42, GIDC Lodhika, Rajkot, Gujarat	24AAACR1234F1Z5	2026-10-22	2026-11-06	Manoj Parmar	PO-RHI-9812	1	2	9971.00	1794.78	0.00	0.22	11766.00	Cash	Posted	Delivered at site with ISI test certificate.	• Price: Ex-works Halol. Packing and forwarding extra at actuals.\n• GST: Extra as applicable (presently 18% or as defined per item).\n• Payment: 100% against delivery.	Admin	2026-10-22 14:21:05.649744+05:30	2026-10-22 14:21:05.649744+05:30	comp_mann
2	2	AMD-01	OC-002	Ahmedabad Chemical Works	Pravin Shah	9879054321	accounts@ahmedabadchem.com	Phase 2, Vatva Industrial Estate, Ahmedabad	24AABCA5678B1Z2	2026-10-22	2026-11-21	Bhavin Patel	REQ-ACW-440	1	1	5782.00	1040.76	0.00	0.24	6823.00	UPI	Posted	Annual maintenance replacement contract.	• Price: Ex-works Halol.\n• GST: 18% extra.	Admin	2026-10-22 14:21:05.659535+05:30	2026-10-22 14:21:05.659535+05:30	comp_mann
3	3	AMD-01	OC-006	Walk-in Retail Customer	Retail Buyer	9876543210	counter@mannengineers.in	Counter Sales, Ahmedabad Central	URP	2026-10-22	2026-10-22	Counter Staff	WALK-092	1	1	1321.60	237.89	0.00	-0.49	1559.00	Cash	Posted	Immediate counter checkout.	• Warranty: 1 year manufacturer warranty.	Admin	2026-10-22 14:21:05.661065+05:30	2026-10-22 14:21:05.661065+05:30	comp_mann
5	4	AMD-01		L&T Construction Hazira	Sanjay Desai	9824099887			24AAACL0123L1Z4	2026-10-22	2026-11-06	Admin		1	1	2643.20	475.78	0.00	0.00	3118.98	Bank Transfer	Posted			Admin	2026-10-22 14:42:20.579553+05:30	2026-10-22 14:42:20.579553+05:30	comp_mann
10	5	AMD-01	OC-548	MANN ENGINEERS	Mitesh Shah	9998282411	\N	PLOT NO 14, RINKI CHOWKDI, HALOL, Panchmahals, Gujarat, PIN: 389350	24AAKHM5573J1ZT	2026-10-22	2026-10-22	Admin		1	2	1657.90	298.42	0.00	0.00	1956.32	Cash	Posted	\N	• Price: Ex-works Halol. Packing and forwarding extra at actuals.\n• GST: Extra as applicable (presently 18% or as defined per item).\n• Payment: 100% against delivery.\n• Delivery: Within 2 to 4 business days from PO receipt.	Admin	2026-10-23 06:36:06.75327+05:30	2026-10-23 06:50:15.774175+05:30	comp_mann
13	6	AMD-01	OC-548	MANN ENGINEERS	Mitesh Shah	9998282411		PLOT NO 14, RINKI CHOWKDI, HALOL, Panchmahals, Gujarat, PIN: 389350	24AAKHM5573J1ZT	2026-10-23	2026-10-23	Admin		1	2	1752.30	315.41	0.00	0.00	2067.71	Cash	Posted		• Price: Ex-works Halol. Packing and forwarding extra at actuals.\n• GST: Extra as applicable (presently 18% or as defined per item).\n• Payment: 100% against delivery.\n• Delivery: Within 2 to 4 business days from PO receipt.	Admin	2026-10-23 14:45:36.984083+05:30	2026-10-23 14:45:36.984083+05:30	comp_mann
14	7	AMD-01	OC-548	MANN ENGINEERS	Mitesh Shah	9998282411		PLOT NO 14, RINKI CHOWKDI, HALOL, Panchmahals, Gujarat, PIN: 389350	24AAKHM5573J1ZT	2026-10-23	2026-10-23	Admin		1	1	2841.00	511.38	0.00	0.00	3352.38	Cash	Posted		• Price: Ex-works Halol. Packing and forwarding extra at actuals.\n• GST: Extra as applicable (presently 18% or as defined per item).\n• Payment: 100% against delivery.\n• Delivery: Within 2 to 4 business days from PO receipt.	Admin	2026-10-23 15:48:52.160387+05:30	2026-10-23 15:48:52.160387+05:30	comp_mann
16	INV-2026-1002	AMD-01		Torrent Pharmaceuticals Ltd		+91 98252 33445	torrentpharmaceuticalsltd@corp.in	Indrad, Kadi, Mehsana	24AAACT5678B1Z9	2026-05-03	\N	Admin		1	2	245143.20	44125.78	12257.16	0.00	277011.82	UPI	Posted			Admin	2026-10-24 09:37:39.68517+05:30	2026-10-24 09:37:39.68517+05:30	comp_mann
17	INV-2026-1003	BRD-02		Gujarat State Fertilizers & Chemicals		+91 98256 77889	gujaratstatefertilizerschemicals@corp.in	Fertilizernagar, Vadodara	24AAACG1122G1Z8	2026-05-04	\N	Admin		1	1	6136.00	1104.48	0.00	0.00	7240.48	UPI	Posted			Admin	2026-10-24 09:37:39.693114+05:30	2026-10-24 09:37:39.693114+05:30	comp_mann
18	INV-2026-1004	AMD-01		Adani Ports & Special Economic Zone		+91 98250 11223	adaniportsspecialeconomiczone@corp.in	Mundra Port SEZ, Kutch	24AAACA1234F1Z1	2026-05-04	\N	Admin		1	3	51252.00	9225.36	2562.60	0.00	57914.76	UPI	Posted			Admin	2026-10-24 09:37:39.695494+05:30	2026-10-24 09:37:39.695494+05:30	comp_mann
19	INV-2026-1005	BRD-02		L&T Knowledge City Complex		+91 98253 44556	ltknowledgecitycomplex@corp.in	NH-8, Waghodia, Vadodara	24AAACL9012C1Z3	2026-05-04	\N	Admin		1	1	388000.00	69840.00	19400.00	0.00	438440.00	Bank Transfer	Posted			Admin	2026-10-24 09:37:39.700415+05:30	2026-10-24 09:37:39.700415+05:30	comp_mann
20	INV-2026-1006	AMD-01		Zydus Lifesciences Biotech Park		+91 98255 66778	zyduslifesciencesbiotechpark@corp.in	Changodar, Ahmedabad	24AAACZ7890E1Z2	2026-05-05	\N	Admin		1	3	419753.80	75555.68	20987.69	0.00	474321.79	Bank Transfer	Posted			Admin	2026-10-24 09:37:39.70704+05:30	2026-10-24 09:37:39.70704+05:30	comp_mann
21	INV-2026-1007	AMD-01		Amul Dairy Technical Facilities		+91 98259 00112	amuldairytechnicalfacilities@corp.in	Anand Main Dairy Campus, Anand	24AAACA7788J1Z6	2026-05-05	\N	Admin		1	1	6490.00	1168.20	0.00	0.00	7658.20	UPI	Posted			Admin	2026-10-24 09:37:39.711388+05:30	2026-10-24 09:37:39.711388+05:30	comp_mann
22	INV-2026-1008	SRU-02		L&T Knowledge City Complex		+91 98253 44556	ltknowledgecitycomplex@corp.in	NH-8, Waghodia, Vadodara	24AAACL9012C1Z3	2026-05-06	\N	Admin		1	3	34216.00	6158.88	1710.80	0.00	38664.08	UPI	Posted			Admin	2026-10-24 09:37:39.71369+05:30	2026-10-24 09:37:39.71369+05:30	comp_mann
23	INV-2026-1009	SRU-02		Zydus Lifesciences Biotech Park		+91 98255 66778	zyduslifesciencesbiotechpark@corp.in	Changodar, Ahmedabad	24AAACZ7890E1Z2	2026-05-07	\N	Admin		1	2	4130.00	743.40	0.00	0.00	4873.40	Bank Transfer	Posted			Admin	2026-10-24 09:37:39.718081+05:30	2026-10-24 09:37:39.718081+05:30	comp_mann
24	INV-2026-1010	SRU-02		Tata Motors Manufacturing Plant		+91 98254 55667	tatamotorsmanufacturingplant@corp.in	GIDC Industrial Estate, Sanand	24AAACT3456D1Z7	2026-05-08	\N	Admin		1	3	23154.10	4167.74	1157.71	0.00	26164.13	Bank Transfer	Posted			Admin	2026-10-24 09:37:39.721157+05:30	2026-10-24 09:37:39.721157+05:30	comp_mann
25	INV-2026-1011	SRU-02		Alembic Pharmaceuticals Limited		+91 98257 88990	alembicpharmaceuticalslimited@corp.in	Alembic Road, Vadodara	24AAACA3344H1Z4	2026-05-10	\N	Admin		1	2	51356.00	9244.08	2567.80	0.00	58032.28	Bank Transfer	Posted			Admin	2026-10-24 09:37:39.725916+05:30	2026-10-24 09:37:39.725916+05:30	comp_mann
26	INV-2026-1012	AND-01		Tata Motors Manufacturing Plant		+91 98254 55667	tatamotorsmanufacturingplant@corp.in	GIDC Industrial Estate, Sanand	24AAACT3456D1Z7	2026-05-11	\N	Admin		1	2	673100.00	121158.00	33655.00	0.00	760603.00	UPI	Posted			Admin	2026-10-24 09:37:39.729409+05:30	2026-10-24 09:37:39.729409+05:30	comp_mann
27	INV-2026-1013	AND-01		Adani Ports & Special Economic Zone		+91 98250 11223	adaniportsspecialeconomiczone@corp.in	Mundra Port SEZ, Kutch	24AAACA1234F1Z1	2026-05-12	\N	Admin		1	2	23805.00	4284.90	1190.25	0.00	26899.65	Cash	Posted			Admin	2026-10-24 09:37:39.732097+05:30	2026-10-24 09:37:39.732097+05:30	comp_mann
28	INV-2026-1014	AMD-01		Torrent Pharmaceuticals Ltd		+91 98252 33445	torrentpharmaceuticalsltd@corp.in	Indrad, Kadi, Mehsana	24AAACT5678B1Z9	2026-05-12	\N	Admin		1	2	286863.00	51635.34	14343.15	0.00	324155.19	Bank Transfer	Posted			Admin	2026-10-24 09:37:39.735346+05:30	2026-10-24 09:37:39.735346+05:30	comp_mann
29	INV-2026-1015	AMD-01		L&T Knowledge City Complex		+91 98253 44556	ltknowledgecitycomplex@corp.in	NH-8, Waghodia, Vadodara	24AAACL9012C1Z3	2026-05-13	\N	Admin		1	1	57344.00	10321.92	2867.20	0.00	64798.72	UPI	Posted			Admin	2026-10-24 09:37:39.738928+05:30	2026-10-24 09:37:39.738928+05:30	comp_mann
30	INV-2026-1016	AMD-01		Shreeji Industrial Safety Systems		+91 98258 99001	shreejiindustrialsafetysystems@corp.in	GIDC Estate, Phase II, Halol	24AAACS5566I1Z0	2026-05-13	\N	Admin		1	2	114028.00	20525.04	5701.40	0.00	128851.64	Card	Posted			Admin	2026-10-24 09:37:39.741811+05:30	2026-10-24 09:37:39.741811+05:30	comp_mann
31	INV-2026-1017	AMD-01		Zydus Lifesciences Biotech Park		+91 98255 66778	zyduslifesciencesbiotechpark@corp.in	Changodar, Ahmedabad	24AAACZ7890E1Z2	2026-05-14	\N	Admin		1	3	886672.00	159600.96	44333.60	0.00	1001939.36	Cash	Posted			Admin	2026-10-24 09:37:39.744656+05:30	2026-10-24 09:37:39.744656+05:30	comp_mann
32	INV-2026-1018	AND-01		Alembic Pharmaceuticals Limited		+91 98257 88990	alembicpharmaceuticalslimited@corp.in	Alembic Road, Vadodara	24AAACA3344H1Z4	2026-05-14	\N	Admin		1	2	5286.40	951.55	0.00	0.00	6237.95	Bank Transfer	Posted			Admin	2026-10-24 09:37:39.751718+05:30	2026-10-24 09:37:39.751718+05:30	comp_mann
33	INV-2026-1019	AND-01		Torrent Pharmaceuticals Ltd		+91 98252 33445	torrentpharmaceuticalsltd@corp.in	Indrad, Kadi, Mehsana	24AAACT5678B1Z9	2026-05-15	\N	Admin		1	1	2596.00	467.28	0.00	0.00	3063.28	Bank Transfer	Posted			Admin	2026-10-24 09:37:39.755035+05:30	2026-10-24 09:37:39.755035+05:30	comp_mann
34	INV-2026-1020	BRD-02		Reliance Industries Ltd (Hazira Complex)		+91 98251 22334	relianceindustriesltdhaziracomplex@corp.in	Hazira Industrial Area, Surat	24AAACR4321A1Z5	2026-05-15	\N	Admin		1	3	20148.10	3626.66	1007.41	0.00	22767.35	Cash	Posted			Admin	2026-10-24 09:37:39.757246+05:30	2026-10-24 09:37:39.757246+05:30	comp_mann
35	INV-2026-1021	AMD-01		Adani Ports & Special Economic Zone		+91 98250 11223	adaniportsspecialeconomiczone@corp.in	Mundra Port SEZ, Kutch	24AAACA1234F1Z1	2026-05-18	\N	Admin		1	2	50572.00	9102.96	2528.60	0.00	57146.36	Bank Transfer	Posted			Admin	2026-10-24 09:37:39.762639+05:30	2026-10-24 09:37:39.762639+05:30	comp_mann
36	INV-2026-1022	BRD-02		Adani Ports & Special Economic Zone		+91 98250 11223	adaniportsspecialeconomiczone@corp.in	Mundra Port SEZ, Kutch	24AAACA1234F1Z1	2026-05-18	\N	Admin		1	3	59325.00	10678.50	2966.25	0.00	67037.25	Bank Transfer	Posted			Admin	2026-10-24 09:37:39.765395+05:30	2026-10-24 09:37:39.765395+05:30	comp_mann
37	INV-2026-1023	AMD-01		Shreeji Industrial Safety Systems		+91 98258 99001	shreejiindustrialsafetysystems@corp.in	GIDC Estate, Phase II, Halol	24AAACS5566I1Z0	2026-05-18	\N	Admin		1	3	26230.00	4721.40	1311.50	0.00	29639.90	Bank Transfer	Posted			Admin	2026-10-24 09:37:39.770109+05:30	2026-10-24 09:37:39.770109+05:30	comp_mann
38	INV-2026-1024	BRD-02		Zydus Lifesciences Biotech Park		+91 98255 66778	zyduslifesciencesbiotechpark@corp.in	Changodar, Ahmedabad	24AAACZ7890E1Z2	2026-05-19	\N	Admin		1	2	296800.00	53424.00	14840.00	0.00	335384.00	Card	Posted			Admin	2026-10-24 09:37:39.774683+05:30	2026-10-24 09:37:39.774683+05:30	comp_mann
39	INV-2026-1025	AMD-01		Adani Ports & Special Economic Zone		+91 98250 11223	adaniportsspecialeconomiczone@corp.in	Mundra Port SEZ, Kutch	24AAACA1234F1Z1	2026-05-19	\N	Admin		1	3	229504.00	41310.72	11475.20	0.00	259339.52	Bank Transfer	Posted			Admin	2026-10-24 09:37:39.777354+05:30	2026-10-24 09:37:39.777354+05:30	comp_mann
40	INV-2026-1026	BRD-02		Zydus Lifesciences Biotech Park		+91 98255 66778	zyduslifesciencesbiotechpark@corp.in	Changodar, Ahmedabad	24AAACZ7890E1Z2	2026-05-19	\N	Admin		1	3	605504.00	108990.72	30275.20	0.00	684219.52	Card	Posted			Admin	2026-10-24 09:37:39.781276+05:30	2026-10-24 09:37:39.781276+05:30	comp_mann
41	INV-2026-1027	AND-01		L&T Knowledge City Complex		+91 98253 44556	ltknowledgecitycomplex@corp.in	NH-8, Waghodia, Vadodara	24AAACL9012C1Z3	2026-05-20	\N	Admin		1	2	389008.90	70021.60	19450.45	0.00	439580.05	UPI	Posted			Admin	2026-10-24 09:37:39.785235+05:30	2026-10-24 09:37:39.785235+05:30	comp_mann
42	INV-2026-1028	SRU-02		Reliance Industries Ltd (Hazira Complex)		+91 98251 22334	relianceindustriesltdhaziracomplex@corp.in	Hazira Industrial Area, Surat	24AAACR4321A1Z5	2026-05-20	\N	Admin		1	3	433136.00	77964.48	21656.80	0.00	489443.68	UPI	Posted			Admin	2026-10-24 09:37:39.788226+05:30	2026-10-24 09:37:39.788226+05:30	comp_mann
43	INV-2026-1029	AMD-01		Torrent Pharmaceuticals Ltd		+91 98252 33445	torrentpharmaceuticalsltd@corp.in	Indrad, Kadi, Mehsana	24AAACT5678B1Z9	2026-05-20	\N	Admin		1	3	871628.00	156893.04	43581.40	0.00	984939.64	UPI	Posted			Admin	2026-10-24 09:37:39.791718+05:30	2026-10-24 09:37:39.791718+05:30	comp_mann
44	INV-2026-1030	AMD-01		L&T Knowledge City Complex		+91 98253 44556	ltknowledgecitycomplex@corp.in	NH-8, Waghodia, Vadodara	24AAACL9012C1Z3	2026-05-21	\N	Admin		1	2	101226.00	18220.68	5061.30	0.00	114385.38	Card	Posted			Admin	2026-10-24 09:37:39.795956+05:30	2026-10-24 09:37:39.795956+05:30	comp_mann
45	INV-2026-1031	AMD-01		Tata Motors Manufacturing Plant		+91 98254 55667	tatamotorsmanufacturingplant@corp.in	GIDC Industrial Estate, Sanand	24AAACT3456D1Z7	2026-05-22	\N	Admin		1	3	16365.00	2945.70	818.25	0.00	18492.45	Bank Transfer	Posted			Admin	2026-10-24 09:37:39.7992+05:30	2026-10-24 09:37:39.7992+05:30	comp_mann
46	INV-2026-1032	AMD-01		Torrent Pharmaceuticals Ltd		+91 98252 33445	torrentpharmaceuticalsltd@corp.in	Indrad, Kadi, Mehsana	24AAACT5678B1Z9	2026-05-22	\N	Admin		1	3	102644.00	18475.92	5132.20	0.00	115987.72	Cash	Posted			Admin	2026-10-24 09:37:39.802496+05:30	2026-10-24 09:37:39.802496+05:30	comp_mann
47	INV-2026-1033	BRD-02		Amul Dairy Technical Facilities		+91 98259 00112	amuldairytechnicalfacilities@corp.in	Anand Main Dairy Campus, Anand	24AAACA7788J1Z6	2026-05-24	\N	Admin		1	3	173554.10	31239.74	8677.71	0.00	196116.13	UPI	Posted			Admin	2026-10-24 09:37:39.806879+05:30	2026-10-24 09:37:39.806879+05:30	comp_mann
48	INV-2026-1034	AMD-01		Tata Motors Manufacturing Plant		+91 98254 55667	tatamotorsmanufacturingplant@corp.in	GIDC Industrial Estate, Sanand	24AAACT3456D1Z7	2026-05-25	\N	Admin		1	3	438181.50	78872.67	21909.08	0.00	495145.09	UPI	Posted			Admin	2026-10-24 09:37:39.810272+05:30	2026-10-24 09:37:39.810272+05:30	comp_mann
49	INV-2026-1035	BRD-02		Adani Ports & Special Economic Zone		+91 98250 11223	adaniportsspecialeconomiczone@corp.in	Mundra Port SEZ, Kutch	24AAACA1234F1Z1	2026-05-26	\N	Admin		1	3	74764.00	13457.52	3738.20	0.00	84483.32	Bank Transfer	Posted			Admin	2026-10-24 09:37:39.813185+05:30	2026-10-24 09:37:39.813185+05:30	comp_mann
50	INV-2026-1036	AMD-01		Reliance Industries Ltd (Hazira Complex)		+91 98251 22334	relianceindustriesltdhaziracomplex@corp.in	Hazira Industrial Area, Surat	24AAACR4321A1Z5	2026-05-26	\N	Admin		1	1	3696.00	665.28	0.00	0.00	4361.28	Bank Transfer	Posted			Admin	2026-10-24 09:37:39.817468+05:30	2026-10-24 09:37:39.817468+05:30	comp_mann
51	INV-2026-1037	AMD-01		Alembic Pharmaceuticals Limited		+91 98257 88990	alembicpharmaceuticalslimited@corp.in	Alembic Road, Vadodara	24AAACA3344H1Z4	2026-05-26	\N	Admin		1	3	169584.00	30525.12	8479.20	0.00	191629.92	Cash	Posted			Admin	2026-10-24 09:37:39.819659+05:30	2026-10-24 09:37:39.819659+05:30	comp_mann
52	INV-2026-1038	AMD-01		Adani Ports & Special Economic Zone		+91 98250 11223	adaniportsspecialeconomiczone@corp.in	Mundra Port SEZ, Kutch	24AAACA1234F1Z1	2026-05-27	\N	Admin		1	2	45194.00	8134.92	2259.70	0.00	51069.22	Bank Transfer	Posted			Admin	2026-10-24 09:37:39.823062+05:30	2026-10-24 09:37:39.823062+05:30	comp_mann
53	INV-2026-1039	BRD-02		Tata Motors Manufacturing Plant		+91 98254 55667	tatamotorsmanufacturingplant@corp.in	GIDC Industrial Estate, Sanand	24AAACT3456D1Z7	2026-05-27	\N	Admin		1	3	80856.00	14554.08	4042.80	0.00	91367.28	UPI	Posted			Admin	2026-10-24 09:37:39.825941+05:30	2026-10-24 09:37:39.825941+05:30	comp_mann
54	INV-2026-1040	AND-01		Gujarat State Fertilizers & Chemicals		+91 98256 77889	gujaratstatefertilizerschemicals@corp.in	Fertilizernagar, Vadodara	24AAACG1122G1Z8	2026-05-27	\N	Admin		1	3	547253.00	98505.54	27362.65	0.00	618395.89	Bank Transfer	Posted			Admin	2026-10-24 09:37:39.829145+05:30	2026-10-24 09:37:39.829145+05:30	comp_mann
55	INV-2026-1041	BRD-02		Torrent Pharmaceuticals Ltd		+91 98252 33445	torrentpharmaceuticalsltd@corp.in	Indrad, Kadi, Mehsana	24AAACT5678B1Z9	2026-05-28	\N	Admin		1	1	5782.00	1040.76	0.00	0.00	6822.76	UPI	Posted			Admin	2026-10-24 09:37:39.832716+05:30	2026-10-24 09:37:39.832716+05:30	comp_mann
56	INV-2026-1042	BRD-02		Gujarat State Fertilizers & Chemicals		+91 98256 77889	gujaratstatefertilizerschemicals@corp.in	Fertilizernagar, Vadodara	24AAACG1122G1Z8	2026-05-28	\N	Admin		1	3	25309.00	4555.62	1265.45	0.00	28599.17	Bank Transfer	Posted			Admin	2026-10-24 09:37:39.836671+05:30	2026-10-24 09:37:39.836671+05:30	comp_mann
57	INV-2026-1043	AND-01		Gujarat State Fertilizers & Chemicals		+91 98256 77889	gujaratstatefertilizerschemicals@corp.in	Fertilizernagar, Vadodara	24AAACG1122G1Z8	2026-05-29	\N	Admin		1	2	19883.00	3578.94	994.15	0.00	22467.79	Card	Posted			Admin	2026-10-24 09:37:39.839555+05:30	2026-10-24 09:37:39.839555+05:30	comp_mann
58	INV-2026-1044	AND-01		Torrent Pharmaceuticals Ltd		+91 98252 33445	torrentpharmaceuticalsltd@corp.in	Indrad, Kadi, Mehsana	24AAACT5678B1Z9	2026-05-31	\N	Admin		1	2	30467.00	5484.06	1523.35	0.00	34427.71	Cash	Posted			Admin	2026-10-24 09:37:39.843082+05:30	2026-10-24 09:37:39.843082+05:30	comp_mann
59	INV-2026-1045	AMD-01		Shreeji Industrial Safety Systems		+91 98258 99001	shreejiindustrialsafetysystems@corp.in	GIDC Estate, Phase II, Halol	24AAACS5566I1Z0	2026-06-01	\N	Admin		1	2	37540.00	6757.20	1877.00	0.00	42420.20	UPI	Posted			Admin	2026-10-24 09:37:39.847237+05:30	2026-10-24 09:37:39.847237+05:30	comp_mann
60	INV-2026-1046	AND-01		Reliance Industries Ltd (Hazira Complex)		+91 98251 22334	relianceindustriesltdhaziracomplex@corp.in	Hazira Industrial Area, Surat	24AAACR4321A1Z5	2026-06-02	\N	Admin		1	3	97361.60	17525.09	4868.08	0.00	110018.61	UPI	Posted			Admin	2026-10-24 09:37:39.851913+05:30	2026-10-24 09:37:39.851913+05:30	comp_mann
61	INV-2026-1047	AMD-01		Amul Dairy Technical Facilities		+91 98259 00112	amuldairytechnicalfacilities@corp.in	Anand Main Dairy Campus, Anand	24AAACA7788J1Z6	2026-06-02	\N	Admin		1	1	1848.00	332.64	0.00	0.00	2180.64	Cash	Posted			Admin	2026-10-24 09:37:39.856416+05:30	2026-10-24 09:37:39.856416+05:30	comp_mann
62	INV-2026-1048	AMD-01		L&T Knowledge City Complex		+91 98253 44556	ltknowledgecitycomplex@corp.in	NH-8, Waghodia, Vadodara	24AAACL9012C1Z3	2026-06-02	\N	Admin		1	1	855.50	153.99	0.00	0.00	1009.49	Bank Transfer	Posted			Admin	2026-10-24 09:37:39.860397+05:30	2026-10-24 09:37:39.860397+05:30	comp_mann
63	INV-2026-1049	AMD-01		Amul Dairy Technical Facilities		+91 98259 00112	amuldairytechnicalfacilities@corp.in	Anand Main Dairy Campus, Anand	24AAACA7788J1Z6	2026-06-03	\N	Admin		1	3	379128.00	68243.04	18956.40	0.00	428414.64	Bank Transfer	Posted			Admin	2026-10-24 09:37:39.864498+05:30	2026-10-24 09:37:39.864498+05:30	comp_mann
64	INV-2026-1050	AND-01		Reliance Industries Ltd (Hazira Complex)		+91 98251 22334	relianceindustriesltdhaziracomplex@corp.in	Hazira Industrial Area, Surat	24AAACR4321A1Z5	2026-06-03	\N	Admin		1	2	9055.00	1629.90	0.00	0.00	10684.90	Cash	Posted			Admin	2026-10-24 09:37:39.869862+05:30	2026-10-24 09:37:39.869862+05:30	comp_mann
65	INV-2026-1051	SRU-02		Tata Motors Manufacturing Plant		+91 98254 55667	tatamotorsmanufacturingplant@corp.in	GIDC Industrial Estate, Sanand	24AAACT3456D1Z7	2026-06-03	\N	Admin		1	1	672.60	121.07	0.00	0.00	793.67	Card	Posted			Admin	2026-10-24 09:37:39.875164+05:30	2026-10-24 09:37:39.875164+05:30	comp_mann
66	INV-2026-1052	AMD-01		Reliance Industries Ltd (Hazira Complex)		+91 98251 22334	relianceindustriesltdhaziracomplex@corp.in	Hazira Industrial Area, Surat	24AAACR4321A1Z5	2026-06-04	\N	Admin		1	2	13082.00	2354.76	0.00	0.00	15436.76	Cash	Posted			Admin	2026-10-24 09:37:39.87821+05:30	2026-10-24 09:37:39.87821+05:30	comp_mann
67	INV-2026-1053	SRU-02		Shreeji Industrial Safety Systems		+91 98258 99001	shreejiindustrialsafetysystems@corp.in	GIDC Estate, Phase II, Halol	24AAACS5566I1Z0	2026-06-04	\N	Admin		1	1	2950.00	531.00	0.00	0.00	3481.00	UPI	Posted			Admin	2026-10-24 09:37:39.881412+05:30	2026-10-24 09:37:39.881412+05:30	comp_mann
68	INV-2026-1054	BRD-02		Gujarat State Fertilizers & Chemicals		+91 98256 77889	gujaratstatefertilizerschemicals@corp.in	Fertilizernagar, Vadodara	24AAACG1122G1Z8	2026-06-04	\N	Admin		1	3	829160.00	149248.80	41458.00	0.00	936950.80	UPI	Posted			Admin	2026-10-24 09:37:39.884465+05:30	2026-10-24 09:37:39.884465+05:30	comp_mann
69	INV-2026-1055	BRD-02		Tata Motors Manufacturing Plant		+91 98254 55667	tatamotorsmanufacturingplant@corp.in	GIDC Industrial Estate, Sanand	24AAACT3456D1Z7	2026-06-05	\N	Admin		1	2	372000.00	66960.00	18600.00	0.00	420360.00	UPI	Posted			Admin	2026-10-24 09:37:39.88883+05:30	2026-10-24 09:37:39.88883+05:30	comp_mann
70	INV-2026-1056	BRD-02		L&T Knowledge City Complex		+91 98253 44556	ltknowledgecitycomplex@corp.in	NH-8, Waghodia, Vadodara	24AAACL9012C1Z3	2026-06-05	\N	Admin		1	1	3808.00	685.44	0.00	0.00	4493.44	Card	Posted			Admin	2026-10-24 09:37:39.891627+05:30	2026-10-24 09:37:39.891627+05:30	comp_mann
71	INV-2026-1057	BRD-02		Gujarat State Fertilizers & Chemicals		+91 98256 77889	gujaratstatefertilizerschemicals@corp.in	Fertilizernagar, Vadodara	24AAACG1122G1Z8	2026-06-05	\N	Admin		1	1	114600.00	20628.00	5730.00	0.00	129498.00	Card	Posted			Admin	2026-10-24 09:37:39.893355+05:30	2026-10-24 09:37:39.893355+05:30	comp_mann
72	INV-2026-1058	AMD-01		L&T Knowledge City Complex		+91 98253 44556	ltknowledgecitycomplex@corp.in	NH-8, Waghodia, Vadodara	24AAACL9012C1Z3	2026-06-06	\N	Admin		1	2	16708.80	3007.58	835.44	0.00	18880.94	Cash	Posted			Admin	2026-10-24 09:37:39.894452+05:30	2026-10-24 09:37:39.894452+05:30	comp_mann
73	INV-2026-1059	AMD-01		Amul Dairy Technical Facilities		+91 98259 00112	amuldairytechnicalfacilities@corp.in	Anand Main Dairy Campus, Anand	24AAACA7788J1Z6	2026-06-07	\N	Admin		1	2	289348.00	52082.64	14467.40	0.00	326963.24	Bank Transfer	Posted			Admin	2026-10-24 09:37:39.896063+05:30	2026-10-24 09:37:39.896063+05:30	comp_mann
74	INV-2026-1060	AMD-01		Zydus Lifesciences Biotech Park		+91 98255 66778	zyduslifesciencesbiotechpark@corp.in	Changodar, Ahmedabad	24AAACZ7890E1Z2	2026-06-08	\N	Admin		1	1	36580.00	6584.40	1829.00	0.00	41335.40	Cash	Posted			Admin	2026-10-24 09:37:39.899166+05:30	2026-10-24 09:37:39.899166+05:30	comp_mann
75	INV-2026-1061	SRU-02		Reliance Industries Ltd (Hazira Complex)		+91 98251 22334	relianceindustriesltdhaziracomplex@corp.in	Hazira Industrial Area, Surat	24AAACR4321A1Z5	2026-06-09	\N	Admin		1	1	17400.00	3132.00	870.00	0.00	19662.00	UPI	Posted			Admin	2026-10-24 09:37:39.901121+05:30	2026-10-24 09:37:39.901121+05:30	comp_mann
76	INV-2026-1062	AND-01		Alembic Pharmaceuticals Limited		+91 98257 88990	alembicpharmaceuticalslimited@corp.in	Alembic Road, Vadodara	24AAACA3344H1Z4	2026-06-09	\N	Admin		1	1	767.00	138.06	0.00	0.00	905.06	Cash	Posted			Admin	2026-10-24 09:37:39.902413+05:30	2026-10-24 09:37:39.902413+05:30	comp_mann
77	INV-2026-1063	AND-01		Torrent Pharmaceuticals Ltd		+91 98252 33445	torrentpharmaceuticalsltd@corp.in	Indrad, Kadi, Mehsana	24AAACT5678B1Z9	2026-06-09	\N	Admin		1	2	18212.00	3278.16	910.60	0.00	20579.56	Card	Posted			Admin	2026-10-24 09:37:39.904316+05:30	2026-10-24 09:37:39.904316+05:30	comp_mann
78	INV-2026-1064	SRU-02		Tata Motors Manufacturing Plant		+91 98254 55667	tatamotorsmanufacturingplant@corp.in	GIDC Industrial Estate, Sanand	24AAACT3456D1Z7	2026-06-10	\N	Admin		1	2	3835.00	690.30	0.00	0.00	4525.30	Cash	Posted			Admin	2026-10-24 09:37:39.906272+05:30	2026-10-24 09:37:39.906272+05:30	comp_mann
79	INV-2026-1065	BRD-02		L&T Knowledge City Complex		+91 98253 44556	ltknowledgecitycomplex@corp.in	NH-8, Waghodia, Vadodara	24AAACL9012C1Z3	2026-06-10	\N	Admin		1	2	71380.00	12848.40	3569.00	0.00	80659.40	UPI	Posted			Admin	2026-10-24 09:37:39.908283+05:30	2026-10-24 09:37:39.908283+05:30	comp_mann
80	INV-2026-1066	SRU-02		Adani Ports & Special Economic Zone		+91 98250 11223	adaniportsspecialeconomiczone@corp.in	Mundra Port SEZ, Kutch	24AAACA1234F1Z1	2026-06-11	\N	Admin		1	3	12546.00	2258.28	0.00	0.00	14804.28	UPI	Posted			Admin	2026-10-24 09:37:39.911674+05:30	2026-10-24 09:37:39.911674+05:30	comp_mann
81	INV-2026-1067	AMD-01		Reliance Industries Ltd (Hazira Complex)		+91 98251 22334	relianceindustriesltdhaziracomplex@corp.in	Hazira Industrial Area, Surat	24AAACR4321A1Z5	2026-06-11	\N	Admin		1	1	19824.00	3568.32	991.20	0.00	22401.12	UPI	Posted			Admin	2026-10-24 09:37:39.91415+05:30	2026-10-24 09:37:39.91415+05:30	comp_mann
82	INV-2026-1068	SRU-02		L&T Knowledge City Complex		+91 98253 44556	ltknowledgecitycomplex@corp.in	NH-8, Waghodia, Vadodara	24AAACL9012C1Z3	2026-06-12	\N	Admin		1	3	77408.00	13933.44	3870.40	0.00	87471.04	Bank Transfer	Posted			Admin	2026-10-24 09:37:39.91574+05:30	2026-10-24 09:37:39.91574+05:30	comp_mann
83	INV-2026-1069	AMD-01		Zydus Lifesciences Biotech Park		+91 98255 66778	zyduslifesciencesbiotechpark@corp.in	Changodar, Ahmedabad	24AAACZ7890E1Z2	2026-06-12	\N	Admin		1	2	24762.00	4457.16	1238.10	0.00	27981.06	Cash	Posted			Admin	2026-10-24 09:37:39.920457+05:30	2026-10-24 09:37:39.920457+05:30	comp_mann
84	INV-2026-1070	AMD-01		Tata Motors Manufacturing Plant		+91 98254 55667	tatamotorsmanufacturingplant@corp.in	GIDC Industrial Estate, Sanand	24AAACT3456D1Z7	2026-06-13	\N	Admin		1	2	250472.00	45084.96	12523.60	0.00	283033.36	Cash	Posted			Admin	2026-10-24 09:37:39.922899+05:30	2026-10-24 09:37:39.922899+05:30	comp_mann
85	INV-2026-1071	AMD-01		Shreeji Industrial Safety Systems		+91 98258 99001	shreejiindustrialsafetysystems@corp.in	GIDC Estate, Phase II, Halol	24AAACS5566I1Z0	2026-06-15	\N	Admin		1	2	12608.90	2269.60	0.00	0.00	14878.50	UPI	Posted			Admin	2026-10-24 09:37:39.926886+05:30	2026-10-24 09:37:39.926886+05:30	comp_mann
86	INV-2026-1072	AMD-01		Reliance Industries Ltd (Hazira Complex)		+91 98251 22334	relianceindustriesltdhaziracomplex@corp.in	Hazira Industrial Area, Surat	24AAACR4321A1Z5	2026-06-16	\N	Admin		1	1	3964.80	713.66	0.00	0.00	4678.46	Bank Transfer	Posted			Admin	2026-10-24 09:37:39.931257+05:30	2026-10-24 09:37:39.931257+05:30	comp_mann
87	INV-2026-1073	AND-01		Shreeji Industrial Safety Systems		+91 98258 99001	shreejiindustrialsafetysystems@corp.in	GIDC Estate, Phase II, Halol	24AAACS5566I1Z0	2026-06-16	\N	Admin		1	3	94600.00	17028.00	4730.00	0.00	106898.00	UPI	Posted			Admin	2026-10-24 09:37:39.934207+05:30	2026-10-24 09:37:39.934207+05:30	comp_mann
88	INV-2026-1074	AMD-01		Adani Ports & Special Economic Zone		+91 98250 11223	adaniportsspecialeconomiczone@corp.in	Mundra Port SEZ, Kutch	24AAACA1234F1Z1	2026-06-17	\N	Admin		1	2	107350.00	19323.00	5367.50	0.00	121305.50	Card	Posted			Admin	2026-10-24 09:37:39.938726+05:30	2026-10-24 09:37:39.938726+05:30	comp_mann
89	INV-2026-1075	AMD-01		Tata Motors Manufacturing Plant		+91 98254 55667	tatamotorsmanufacturingplant@corp.in	GIDC Industrial Estate, Sanand	24AAACT3456D1Z7	2026-06-17	\N	Admin		1	3	30732.00	5531.76	1536.60	0.00	34727.16	UPI	Posted			Admin	2026-10-24 09:37:39.942997+05:30	2026-10-24 09:37:39.942997+05:30	comp_mann
90	INV-2026-1076	BRD-02		L&T Knowledge City Complex		+91 98253 44556	ltknowledgecitycomplex@corp.in	NH-8, Waghodia, Vadodara	24AAACL9012C1Z3	2026-06-18	\N	Admin		1	3	32935.00	5928.30	1646.75	0.00	37216.55	Bank Transfer	Posted			Admin	2026-10-24 09:37:39.948012+05:30	2026-10-24 09:37:39.948012+05:30	comp_mann
91	INV-2026-1077	SRU-02		Tata Motors Manufacturing Plant		+91 98254 55667	tatamotorsmanufacturingplant@corp.in	GIDC Industrial Estate, Sanand	24AAACT3456D1Z7	2026-06-18	\N	Admin		1	1	35280.00	6350.40	1764.00	0.00	39866.40	Cash	Posted			Admin	2026-10-24 09:37:39.951909+05:30	2026-10-24 09:37:39.951909+05:30	comp_mann
92	INV-2026-1078	AND-01		Torrent Pharmaceuticals Ltd		+91 98252 33445	torrentpharmaceuticalsltd@corp.in	Indrad, Kadi, Mehsana	24AAACT5678B1Z9	2026-06-18	\N	Admin		1	2	36814.00	6626.52	1840.70	0.00	41599.82	Cash	Posted			Admin	2026-10-24 09:37:39.955283+05:30	2026-10-24 09:37:39.955283+05:30	comp_mann
93	INV-2026-1079	AMD-01		Adani Ports & Special Economic Zone		+91 98250 11223	adaniportsspecialeconomiczone@corp.in	Mundra Port SEZ, Kutch	24AAACA1234F1Z1	2026-06-19	\N	Admin		1	1	55500.00	9990.00	2775.00	0.00	62715.00	Card	Posted			Admin	2026-10-24 09:37:39.957714+05:30	2026-10-24 09:37:39.957714+05:30	comp_mann
94	INV-2026-1080	BRD-02		L&T Knowledge City Complex		+91 98253 44556	ltknowledgecitycomplex@corp.in	NH-8, Waghodia, Vadodara	24AAACL9012C1Z3	2026-06-21	\N	Admin		1	1	23128.00	4163.04	1156.40	0.00	26134.64	UPI	Posted			Admin	2026-10-24 09:37:39.959455+05:30	2026-10-24 09:37:39.959455+05:30	comp_mann
95	INV-2026-1081	SRU-02		Gujarat State Fertilizers & Chemicals		+91 98256 77889	gujaratstatefertilizerschemicals@corp.in	Fertilizernagar, Vadodara	24AAACG1122G1Z8	2026-06-22	\N	Admin		1	1	3964.80	713.66	0.00	0.00	4678.46	Bank Transfer	Posted			Admin	2026-10-24 09:37:39.963253+05:30	2026-10-24 09:37:39.963253+05:30	comp_mann
96	INV-2026-1082	AMD-01		Tata Motors Manufacturing Plant		+91 98254 55667	tatamotorsmanufacturingplant@corp.in	GIDC Industrial Estate, Sanand	24AAACT3456D1Z7	2026-06-22	\N	Admin		1	2	349884.00	62979.12	17494.20	0.00	395368.92	Cash	Posted			Admin	2026-10-24 09:37:39.96525+05:30	2026-10-24 09:37:39.96525+05:30	comp_mann
97	INV-2026-1083	AMD-01		Alembic Pharmaceuticals Limited		+91 98257 88990	alembicpharmaceuticalslimited@corp.in	Alembic Road, Vadodara	24AAACA3344H1Z4	2026-06-22	\N	Admin		1	1	1298.00	233.64	0.00	0.00	1531.64	UPI	Posted			Admin	2026-10-24 09:37:39.968476+05:30	2026-10-24 09:37:39.968476+05:30	comp_mann
98	INV-2026-1084	BRD-02		Zydus Lifesciences Biotech Park		+91 98255 66778	zyduslifesciencesbiotechpark@corp.in	Changodar, Ahmedabad	24AAACZ7890E1Z2	2026-06-23	\N	Admin		1	3	50796.00	9143.28	2539.80	0.00	57399.48	UPI	Posted			Admin	2026-10-24 09:37:39.970762+05:30	2026-10-24 09:37:39.970762+05:30	comp_mann
99	INV-2026-1085	BRD-02		Amul Dairy Technical Facilities		+91 98259 00112	amuldairytechnicalfacilities@corp.in	Anand Main Dairy Campus, Anand	24AAACA7788J1Z6	2026-06-23	\N	Admin		1	1	1534.00	276.12	0.00	0.00	1810.12	Bank Transfer	Posted			Admin	2026-10-24 09:37:39.974283+05:30	2026-10-24 09:37:39.974283+05:30	comp_mann
100	INV-2026-1086	AND-01		Amul Dairy Technical Facilities		+91 98259 00112	amuldairytechnicalfacilities@corp.in	Anand Main Dairy Campus, Anand	24AAACA7788J1Z6	2026-06-23	\N	Admin		1	2	52923.00	9526.14	2646.15	0.00	59802.99	Cash	Posted			Admin	2026-10-24 09:37:39.976705+05:30	2026-10-24 09:37:39.976705+05:30	comp_mann
101	INV-2026-1087	AND-01		Reliance Industries Ltd (Hazira Complex)		+91 98251 22334	relianceindustriesltdhaziracomplex@corp.in	Hazira Industrial Area, Surat	24AAACR4321A1Z5	2026-06-24	\N	Admin		1	1	9251.20	1665.22	0.00	0.00	10916.42	UPI	Posted			Admin	2026-10-24 09:37:39.97929+05:30	2026-10-24 09:37:39.97929+05:30	comp_mann
102	INV-2026-1088	BRD-02		L&T Knowledge City Complex		+91 98253 44556	ltknowledgecitycomplex@corp.in	NH-8, Waghodia, Vadodara	24AAACL9012C1Z3	2026-06-25	\N	Admin		1	1	6136.00	1104.48	0.00	0.00	7240.48	Bank Transfer	Posted			Admin	2026-10-24 09:37:39.981177+05:30	2026-10-24 09:37:39.981177+05:30	comp_mann
103	INV-2026-1089	AND-01		Tata Motors Manufacturing Plant		+91 98254 55667	tatamotorsmanufacturingplant@corp.in	GIDC Industrial Estate, Sanand	24AAACT3456D1Z7	2026-06-25	\N	Admin		1	3	33014.00	5942.52	1650.70	0.00	37305.82	UPI	Posted			Admin	2026-10-24 09:37:39.983148+05:30	2026-10-24 09:37:39.983148+05:30	comp_mann
104	INV-2026-1090	AND-01		Tata Motors Manufacturing Plant		+91 98254 55667	tatamotorsmanufacturingplant@corp.in	GIDC Industrial Estate, Sanand	24AAACT3456D1Z7	2026-06-26	\N	Admin		1	2	53808.00	9685.44	2690.40	0.00	60803.04	UPI	Posted			Admin	2026-10-24 09:37:39.986665+05:30	2026-10-24 09:37:39.986665+05:30	comp_mann
105	INV-2026-1091	AMD-01		Torrent Pharmaceuticals Ltd		+91 98252 33445	torrentpharmaceuticalsltd@corp.in	Indrad, Kadi, Mehsana	24AAACT5678B1Z9	2026-06-26	\N	Admin		1	3	97004.00	17460.72	4850.20	0.00	109614.52	Bank Transfer	Posted			Admin	2026-10-24 09:37:39.990426+05:30	2026-10-24 09:37:39.990426+05:30	comp_mann
106	INV-2026-1092	AMD-01		Adani Ports & Special Economic Zone		+91 98250 11223	adaniportsspecialeconomiczone@corp.in	Mundra Port SEZ, Kutch	24AAACA1234F1Z1	2026-06-26	\N	Admin		1	2	3309.90	595.78	0.00	0.00	3905.68	UPI	Posted			Admin	2026-10-24 09:37:39.992881+05:30	2026-10-24 09:37:39.992881+05:30	comp_mann
107	INV-2026-1093	AND-01		Shreeji Industrial Safety Systems		+91 98258 99001	shreejiindustrialsafetysystems@corp.in	GIDC Estate, Phase II, Halol	24AAACS5566I1Z0	2026-06-27	\N	Admin		1	1	7300.00	1314.00	0.00	0.00	8614.00	UPI	Posted			Admin	2026-10-24 09:37:39.99766+05:30	2026-10-24 09:37:39.99766+05:30	comp_mann
108	INV-2026-1094	AMD-01		Amul Dairy Technical Facilities		+91 98259 00112	amuldairytechnicalfacilities@corp.in	Anand Main Dairy Campus, Anand	24AAACA7788J1Z6	2026-06-28	\N	Admin		1	2	44368.00	7986.24	2218.40	0.00	50135.84	UPI	Posted			Admin	2026-10-24 09:37:39.999127+05:30	2026-10-24 09:37:39.999127+05:30	comp_mann
109	INV-2026-1095	SRU-02		Shreeji Industrial Safety Systems		+91 98258 99001	shreejiindustrialsafetysystems@corp.in	GIDC Estate, Phase II, Halol	24AAACS5566I1Z0	2026-06-29	\N	Admin		1	2	17776.00	3199.68	888.80	0.00	20086.88	Bank Transfer	Posted			Admin	2026-10-24 09:37:40.001579+05:30	2026-10-24 09:37:40.001579+05:30	comp_mann
110	INV-2026-1096	AMD-01		Reliance Industries Ltd (Hazira Complex)		+91 98251 22334	relianceindustriesltdhaziracomplex@corp.in	Hazira Industrial Area, Surat	24AAACR4321A1Z5	2026-06-30	\N	Admin		1	1	25200.00	4536.00	1260.00	0.00	28476.00	Bank Transfer	Posted			Admin	2026-10-24 09:37:40.00528+05:30	2026-10-24 09:37:40.00528+05:30	comp_mann
111	INV-2026-1097	BRD-02		Torrent Pharmaceuticals Ltd		+91 98252 33445	torrentpharmaceuticalsltd@corp.in	Indrad, Kadi, Mehsana	24AAACT5678B1Z9	2026-06-30	\N	Admin		1	2	76301.00	13734.18	3815.05	0.00	86220.13	Card	Posted			Admin	2026-10-24 09:37:40.006837+05:30	2026-10-24 09:37:40.006837+05:30	comp_mann
112	INV-2026-1098	AMD-01		L&T Knowledge City Complex		+91 98253 44556	ltknowledgecitycomplex@corp.in	NH-8, Waghodia, Vadodara	24AAACL9012C1Z3	2026-06-30	\N	Admin		1	1	2950.00	531.00	0.00	0.00	3481.00	Card	Posted			Admin	2026-10-24 09:37:40.009778+05:30	2026-10-24 09:37:40.009778+05:30	comp_mann
113	INV-2026-1099	AND-01		Amul Dairy Technical Facilities		+91 98259 00112	amuldairytechnicalfacilities@corp.in	Anand Main Dairy Campus, Anand	24AAACA7788J1Z6	2026-07-01	\N	Admin		1	3	402455.00	72441.90	20122.75	0.00	454774.15	UPI	Posted			Admin	2026-10-24 09:37:40.012521+05:30	2026-10-24 09:37:40.012521+05:30	comp_mann
114	INV-2026-1100	AND-01		Gujarat State Fertilizers & Chemicals		+91 98256 77889	gujaratstatefertilizerschemicals@corp.in	Fertilizernagar, Vadodara	24AAACG1122G1Z8	2026-07-01	\N	Admin		1	3	17214.40	3098.59	860.72	0.00	19452.27	UPI	Posted			Admin	2026-10-24 09:37:40.015372+05:30	2026-10-24 09:37:40.015372+05:30	comp_mann
115	INV-2026-1101	BRD-02		Tata Motors Manufacturing Plant		+91 98254 55667	tatamotorsmanufacturingplant@corp.in	GIDC Industrial Estate, Sanand	24AAACT3456D1Z7	2026-07-02	\N	Admin		1	2	10561.00	1900.98	0.00	0.00	12461.98	UPI	Posted			Admin	2026-10-24 09:37:40.019272+05:30	2026-10-24 09:37:40.019272+05:30	comp_mann
116	INV-2026-1102	AMD-01		L&T Knowledge City Complex		+91 98253 44556	ltknowledgecitycomplex@corp.in	NH-8, Waghodia, Vadodara	24AAACL9012C1Z3	2026-07-03	\N	Admin		1	2	132000.00	23760.00	6600.00	0.00	149160.00	Card	Posted			Admin	2026-10-24 09:37:40.022455+05:30	2026-10-24 09:37:40.022455+05:30	comp_mann
117	INV-2026-1103	BRD-02		Shreeji Industrial Safety Systems		+91 98258 99001	shreejiindustrialsafetysystems@corp.in	GIDC Estate, Phase II, Halol	24AAACS5566I1Z0	2026-07-03	\N	Admin		1	3	61988.00	11157.84	3099.40	0.00	70046.44	Cash	Posted			Admin	2026-10-24 09:37:40.025037+05:30	2026-10-24 09:37:40.025037+05:30	comp_mann
118	INV-2026-1104	SRU-02		Adani Ports & Special Economic Zone		+91 98250 11223	adaniportsspecialeconomiczone@corp.in	Mundra Port SEZ, Kutch	24AAACA1234F1Z1	2026-07-03	\N	Admin		1	1	2301.00	414.18	0.00	0.00	2715.18	Bank Transfer	Posted			Admin	2026-10-24 09:37:40.02736+05:30	2026-10-24 09:37:40.02736+05:30	comp_mann
119	INV-2026-1105	AND-01		Shreeji Industrial Safety Systems		+91 98258 99001	shreejiindustrialsafetysystems@corp.in	GIDC Estate, Phase II, Halol	24AAACS5566I1Z0	2026-07-04	\N	Admin		1	3	53502.00	9630.36	2675.10	0.00	60457.26	UPI	Posted			Admin	2026-10-24 09:37:40.029909+05:30	2026-10-24 09:37:40.029909+05:30	comp_mann
120	INV-2026-1106	AMD-01		L&T Knowledge City Complex		+91 98253 44556	ltknowledgecitycomplex@corp.in	NH-8, Waghodia, Vadodara	24AAACL9012C1Z3	2026-07-05	\N	Admin		1	3	11959.30	2152.67	0.00	0.00	14111.97	Card	Posted			Admin	2026-10-24 09:37:40.03338+05:30	2026-10-24 09:37:40.03338+05:30	comp_mann
121	INV-2026-1107	AND-01		Gujarat State Fertilizers & Chemicals		+91 98256 77889	gujaratstatefertilizerschemicals@corp.in	Fertilizernagar, Vadodara	24AAACG1122G1Z8	2026-07-06	\N	Admin		1	1	11328.00	2039.04	0.00	0.00	13367.04	UPI	Posted			Admin	2026-10-24 09:37:40.036063+05:30	2026-10-24 09:37:40.036063+05:30	comp_mann
122	INV-2026-1108	BRD-02		Reliance Industries Ltd (Hazira Complex)		+91 98251 22334	relianceindustriesltdhaziracomplex@corp.in	Hazira Industrial Area, Surat	24AAACR4321A1Z5	2026-07-06	\N	Admin		1	2	34674.00	6241.32	1733.70	0.00	39181.62	Cash	Posted			Admin	2026-10-24 09:37:40.038627+05:30	2026-10-24 09:37:40.038627+05:30	comp_mann
123	INV-2026-1109	AMD-01		Gujarat State Fertilizers & Chemicals		+91 98256 77889	gujaratstatefertilizerschemicals@corp.in	Fertilizernagar, Vadodara	24AAACG1122G1Z8	2026-07-07	\N	Admin		1	2	6128.80	1103.18	0.00	0.00	7231.98	Cash	Posted			Admin	2026-10-24 09:37:40.040807+05:30	2026-10-24 09:37:40.040807+05:30	comp_mann
124	INV-2026-1110	AMD-01		Adani Ports & Special Economic Zone		+91 98250 11223	adaniportsspecialeconomiczone@corp.in	Mundra Port SEZ, Kutch	24AAACA1234F1Z1	2026-07-07	\N	Admin		1	2	25543.00	4597.74	1277.15	0.00	28863.59	Card	Posted			Admin	2026-10-24 09:37:40.043219+05:30	2026-10-24 09:37:40.043219+05:30	comp_mann
125	INV-2026-1111	AMD-01		Tata Motors Manufacturing Plant		+91 98254 55667	tatamotorsmanufacturingplant@corp.in	GIDC Industrial Estate, Sanand	24AAACT3456D1Z7	2026-07-08	\N	Admin		1	2	5951.00	1071.18	0.00	0.00	7022.18	Bank Transfer	Posted			Admin	2026-10-24 09:37:40.047431+05:30	2026-10-24 09:37:40.047431+05:30	comp_mann
126	INV-2026-1112	AMD-01		Tata Motors Manufacturing Plant		+91 98254 55667	tatamotorsmanufacturingplant@corp.in	GIDC Industrial Estate, Sanand	24AAACT3456D1Z7	2026-07-09	\N	Admin		1	3	74312.00	13376.16	3715.60	0.00	83972.56	UPI	Posted			Admin	2026-10-24 09:37:40.051354+05:30	2026-10-24 09:37:40.051354+05:30	comp_mann
127	INV-2026-1113	AMD-01		Gujarat State Fertilizers & Chemicals		+91 98256 77889	gujaratstatefertilizerschemicals@corp.in	Fertilizernagar, Vadodara	24AAACG1122G1Z8	2026-07-10	\N	Admin		1	2	27671.00	4980.78	1383.55	0.00	31268.23	Card	Posted			Admin	2026-10-24 09:37:40.055932+05:30	2026-10-24 09:37:40.055932+05:30	comp_mann
128	INV-2026-1114	AND-01		Tata Motors Manufacturing Plant		+91 98254 55667	tatamotorsmanufacturingplant@corp.in	GIDC Industrial Estate, Sanand	24AAACT3456D1Z7	2026-07-11	\N	Admin		1	1	17150.00	3087.00	857.50	0.00	19379.50	Card	Posted			Admin	2026-10-24 09:37:40.05994+05:30	2026-10-24 09:37:40.05994+05:30	comp_mann
129	INV-2026-1115	AMD-01		Alembic Pharmaceuticals Limited		+91 98257 88990	alembicpharmaceuticalslimited@corp.in	Alembic Road, Vadodara	24AAACA3344H1Z4	2026-07-13	\N	Admin		1	1	21948.00	3950.64	1097.40	0.00	24801.24	UPI	Posted			Admin	2026-10-24 09:37:40.061747+05:30	2026-10-24 09:37:40.061747+05:30	comp_mann
130	INV-2026-1116	BRD-02		Alembic Pharmaceuticals Limited		+91 98257 88990	alembicpharmaceuticalslimited@corp.in	Alembic Road, Vadodara	24AAACA3344H1Z4	2026-07-13	\N	Admin		1	1	29264.00	5267.52	1463.20	0.00	33068.32	UPI	Posted			Admin	2026-10-24 09:37:40.06428+05:30	2026-10-24 09:37:40.06428+05:30	comp_mann
131	INV-2026-1117	AMD-01		Gujarat State Fertilizers & Chemicals		+91 98256 77889	gujaratstatefertilizerschemicals@corp.in	Fertilizernagar, Vadodara	24AAACG1122G1Z8	2026-07-14	\N	Admin		1	2	40152.00	7227.36	2007.60	0.00	45371.76	Cash	Posted			Admin	2026-10-24 09:37:40.066751+05:30	2026-10-24 09:37:40.066751+05:30	comp_mann
132	INV-2026-1118	AMD-01		Gujarat State Fertilizers & Chemicals		+91 98256 77889	gujaratstatefertilizerschemicals@corp.in	Fertilizernagar, Vadodara	24AAACG1122G1Z8	2026-07-14	\N	Admin		1	1	10950.00	1971.00	0.00	0.00	12921.00	Bank Transfer	Posted			Admin	2026-10-24 09:37:40.068632+05:30	2026-10-24 09:37:40.068632+05:30	comp_mann
133	INV-2026-1119	AMD-01		Torrent Pharmaceuticals Ltd		+91 98252 33445	torrentpharmaceuticalsltd@corp.in	Indrad, Kadi, Mehsana	24AAACT5678B1Z9	2026-07-14	\N	Admin		1	3	63556.00	11440.08	3177.80	0.00	71818.28	UPI	Posted			Admin	2026-10-24 09:37:40.070107+05:30	2026-10-24 09:37:40.070107+05:30	comp_mann
134	INV-2026-1120	BRD-02		L&T Knowledge City Complex		+91 98253 44556	ltknowledgecitycomplex@corp.in	NH-8, Waghodia, Vadodara	24AAACL9012C1Z3	2026-07-15	\N	Admin		1	3	293149.70	52766.95	14657.49	0.00	331259.16	Card	Posted			Admin	2026-10-24 09:37:40.073862+05:30	2026-10-24 09:37:40.073862+05:30	comp_mann
135	INV-2026-1121	AMD-01		L&T Knowledge City Complex		+91 98253 44556	ltknowledgecitycomplex@corp.in	NH-8, Waghodia, Vadodara	24AAACL9012C1Z3	2026-07-15	\N	Admin		1	1	97000.00	17460.00	4850.00	0.00	109610.00	Bank Transfer	Posted			Admin	2026-10-24 09:37:40.076982+05:30	2026-10-24 09:37:40.076982+05:30	comp_mann
136	INV-2026-1122	SRU-02		Shreeji Industrial Safety Systems		+91 98258 99001	shreejiindustrialsafetysystems@corp.in	GIDC Estate, Phase II, Halol	24AAACS5566I1Z0	2026-07-16	\N	Admin		1	1	2596.00	467.28	0.00	0.00	3063.28	UPI	Posted			Admin	2026-10-24 09:37:40.078966+05:30	2026-10-24 09:37:40.078966+05:30	comp_mann
137	INV-2026-1123	AMD-01		Reliance Industries Ltd (Hazira Complex)		+91 98251 22334	relianceindustriesltdhaziracomplex@corp.in	Hazira Industrial Area, Surat	24AAACR4321A1Z5	2026-07-16	\N	Admin		1	2	30411.10	5474.00	1520.56	0.00	34364.54	Card	Posted			Admin	2026-10-24 09:37:40.08134+05:30	2026-10-24 09:37:40.08134+05:30	comp_mann
138	INV-2026-1124	SRU-02		Shreeji Industrial Safety Systems		+91 98258 99001	shreejiindustrialsafetysystems@corp.in	GIDC Estate, Phase II, Halol	24AAACS5566I1Z0	2026-07-17	\N	Admin		1	3	80125.00	14422.50	4006.25	0.00	90541.25	Bank Transfer	Posted			Admin	2026-10-24 09:37:40.083365+05:30	2026-10-24 09:37:40.083365+05:30	comp_mann
139	INV-2026-1125	BRD-02		Reliance Industries Ltd (Hazira Complex)		+91 98251 22334	relianceindustriesltdhaziracomplex@corp.in	Hazira Industrial Area, Surat	24AAACR4321A1Z5	2026-07-17	\N	Admin		1	2	192835.00	34710.30	9641.75	0.00	217903.55	UPI	Posted			Admin	2026-10-24 09:37:40.086634+05:30	2026-10-24 09:37:40.086634+05:30	comp_mann
140	INV-2026-1126	AMD-01		Gujarat State Fertilizers & Chemicals		+91 98256 77889	gujaratstatefertilizerschemicals@corp.in	Fertilizernagar, Vadodara	24AAACG1122G1Z8	2026-07-18	\N	Admin		1	1	2950.00	531.00	0.00	0.00	3481.00	UPI	Posted			Admin	2026-10-24 09:37:40.090066+05:30	2026-10-24 09:37:40.090066+05:30	comp_mann
141	INV-2026-1127	BRD-02		L&T Knowledge City Complex		+91 98253 44556	ltknowledgecitycomplex@corp.in	NH-8, Waghodia, Vadodara	24AAACL9012C1Z3	2026-07-19	\N	Admin		1	3	854644.00	153835.92	42732.20	0.00	965747.72	Cash	Posted			Admin	2026-10-24 09:37:40.0918+05:30	2026-10-24 09:37:40.0918+05:30	comp_mann
142	INV-2026-1128	AMD-01		Zydus Lifesciences Biotech Park		+91 98255 66778	zyduslifesciencesbiotechpark@corp.in	Changodar, Ahmedabad	24AAACZ7890E1Z2	2026-07-20	\N	Admin		1	2	7900.00	1422.00	0.00	0.00	9322.00	Card	Posted			Admin	2026-10-24 09:37:40.094711+05:30	2026-10-24 09:37:40.094711+05:30	comp_mann
143	INV-2026-1129	SRU-02		Zydus Lifesciences Biotech Park		+91 98255 66778	zyduslifesciencesbiotechpark@corp.in	Changodar, Ahmedabad	24AAACZ7890E1Z2	2026-07-21	\N	Admin		1	1	3068.00	552.24	0.00	0.00	3620.24	Bank Transfer	Posted			Admin	2026-10-24 09:37:40.097359+05:30	2026-10-24 09:37:40.097359+05:30	comp_mann
144	INV-2026-1130	AMD-01		Adani Ports & Special Economic Zone		+91 98250 11223	adaniportsspecialeconomiczone@corp.in	Mundra Port SEZ, Kutch	24AAACA1234F1Z1	2026-07-22	\N	Admin		1	2	5376.30	967.73	0.00	0.00	6344.03	Bank Transfer	Posted			Admin	2026-10-24 09:37:40.099506+05:30	2026-10-24 09:37:40.099506+05:30	comp_mann
145	INV-2026-1131	AMD-01		Shreeji Industrial Safety Systems		+91 98258 99001	shreejiindustrialsafetysystems@corp.in	GIDC Estate, Phase II, Halol	24AAACS5566I1Z0	2026-07-22	\N	Admin		1	1	74000.00	13320.00	3700.00	0.00	83620.00	Bank Transfer	Posted			Admin	2026-10-24 09:37:40.102639+05:30	2026-10-24 09:37:40.102639+05:30	comp_mann
146	INV-2026-1132	BRD-02		Torrent Pharmaceuticals Ltd		+91 98252 33445	torrentpharmaceuticalsltd@corp.in	Indrad, Kadi, Mehsana	24AAACT5678B1Z9	2026-07-22	\N	Admin		1	2	22944.00	4129.92	1147.20	0.00	25926.72	Bank Transfer	Posted			Admin	2026-10-24 09:37:40.107505+05:30	2026-10-24 09:37:40.107505+05:30	comp_mann
147	INV-2026-1133	AND-01		Adani Ports & Special Economic Zone		+91 98250 11223	adaniportsspecialeconomiczone@corp.in	Mundra Port SEZ, Kutch	24AAACA1234F1Z1	2026-07-23	\N	Admin		1	3	40732.00	7331.76	2036.60	0.00	46027.16	UPI	Posted			Admin	2026-10-24 09:37:40.109609+05:30	2026-10-24 09:37:40.109609+05:30	comp_mann
148	INV-2026-1134	AMD-01		Zydus Lifesciences Biotech Park		+91 98255 66778	zyduslifesciencesbiotechpark@corp.in	Changodar, Ahmedabad	24AAACZ7890E1Z2	2026-07-23	\N	Admin		1	3	24525.00	4414.50	1226.25	0.00	27713.25	Bank Transfer	Posted			Admin	2026-10-24 09:37:40.113154+05:30	2026-10-24 09:37:40.113154+05:30	comp_mann
149	INV-2026-1135	BRD-02		Shreeji Industrial Safety Systems		+91 98258 99001	shreejiindustrialsafetysystems@corp.in	GIDC Estate, Phase II, Halol	24AAACS5566I1Z0	2026-07-23	\N	Admin		1	1	3894.00	700.92	0.00	0.00	4594.92	Cash	Posted			Admin	2026-10-24 09:37:40.116384+05:30	2026-10-24 09:37:40.116384+05:30	comp_mann
150	INV-2026-1136	AMD-01		Shreeji Industrial Safety Systems		+91 98258 99001	shreejiindustrialsafetysystems@corp.in	GIDC Estate, Phase II, Halol	24AAACS5566I1Z0	2026-07-24	\N	Admin		1	3	304098.00	54737.64	15204.90	0.00	343630.74	Cash	Posted			Admin	2026-10-24 09:37:40.12226+05:30	2026-10-24 09:37:40.12226+05:30	comp_mann
151	INV-2026-1137	AMD-01		Tata Motors Manufacturing Plant		+91 98254 55667	tatamotorsmanufacturingplant@corp.in	GIDC Industrial Estate, Sanand	24AAACT3456D1Z7	2026-07-24	\N	Admin		1	1	2643.20	475.78	0.00	0.00	3118.98	Bank Transfer	Posted			Admin	2026-10-24 09:37:40.124743+05:30	2026-10-24 09:37:40.124743+05:30	comp_mann
152	INV-2026-1138	AMD-01		Alembic Pharmaceuticals Limited		+91 98257 88990	alembicpharmaceuticalslimited@corp.in	Alembic Road, Vadodara	24AAACA3344H1Z4	2026-07-24	\N	Admin		1	3	56474.00	10165.32	2823.70	0.00	63815.62	UPI	Posted			Admin	2026-10-24 09:37:40.127248+05:30	2026-10-24 09:37:40.127248+05:30	comp_mann
153	INV-2026-1139	SRU-02		Alembic Pharmaceuticals Limited		+91 98257 88990	alembicpharmaceuticalslimited@corp.in	Alembic Road, Vadodara	24AAACA3344H1Z4	2026-07-26	\N	Admin		1	1	92500.00	16650.00	4625.00	0.00	104525.00	UPI	Posted			Admin	2026-10-24 09:37:40.131431+05:30	2026-10-24 09:37:40.131431+05:30	comp_mann
154	INV-2026-1140	SRU-02		L&T Knowledge City Complex		+91 98253 44556	ltknowledgecitycomplex@corp.in	NH-8, Waghodia, Vadodara	24AAACL9012C1Z3	2026-07-27	\N	Admin		1	3	197673.00	35581.14	9883.65	0.00	223370.49	Bank Transfer	Posted			Admin	2026-10-24 09:37:40.133224+05:30	2026-10-24 09:37:40.133224+05:30	comp_mann
155	INV-2026-1141	AND-01		Shreeji Industrial Safety Systems		+91 98258 99001	shreejiindustrialsafetysystems@corp.in	GIDC Estate, Phase II, Halol	24AAACS5566I1Z0	2026-07-27	\N	Admin		1	3	16444.00	2959.92	822.20	0.00	18581.72	Card	Posted			Admin	2026-10-24 09:37:40.137237+05:30	2026-10-24 09:37:40.137237+05:30	comp_mann
156	INV-2026-1142	AMD-01		Adani Ports & Special Economic Zone		+91 98250 11223	adaniportsspecialeconomiczone@corp.in	Mundra Port SEZ, Kutch	24AAACA1234F1Z1	2026-07-28	\N	Admin		1	3	79535.20	14316.34	3976.76	0.00	89874.78	Cash	Posted			Admin	2026-10-24 09:37:40.139066+05:30	2026-10-24 09:37:40.139066+05:30	comp_mann
157	INV-2026-1143	AMD-01		Torrent Pharmaceuticals Ltd		+91 98252 33445	torrentpharmaceuticalsltd@corp.in	Indrad, Kadi, Mehsana	24AAACT5678B1Z9	2026-07-29	\N	Admin		1	1	14784.00	2661.12	0.00	0.00	17445.12	Cash	Posted			Admin	2026-10-24 09:37:40.141486+05:30	2026-10-24 09:37:40.141486+05:30	comp_mann
158	INV-2026-1144	AND-01		Zydus Lifesciences Biotech Park		+91 98255 66778	zyduslifesciencesbiotechpark@corp.in	Changodar, Ahmedabad	24AAACZ7890E1Z2	2026-07-29	\N	Admin		1	1	1534.00	276.12	0.00	0.00	1810.12	Bank Transfer	Posted			Admin	2026-10-24 09:37:40.143631+05:30	2026-10-24 09:37:40.143631+05:30	comp_mann
159	INV-2026-1145	AMD-01		L&T Knowledge City Complex		+91 98253 44556	ltknowledgecitycomplex@corp.in	NH-8, Waghodia, Vadodara	24AAACL9012C1Z3	2026-07-29	\N	Admin		1	3	87329.00	15719.22	4366.45	0.00	98681.77	Bank Transfer	Posted			Admin	2026-10-24 09:37:40.145085+05:30	2026-10-24 09:37:40.145085+05:30	comp_mann
160	INV-2026-1146	AMD-01		Gujarat State Fertilizers & Chemicals		+91 98256 77889	gujaratstatefertilizerschemicals@corp.in	Fertilizernagar, Vadodara	24AAACG1122G1Z8	2026-07-30	\N	Admin		1	1	3894.00	700.92	0.00	0.00	4594.92	UPI	Posted			Admin	2026-10-24 09:37:40.14762+05:30	2026-10-24 09:37:40.14762+05:30	comp_mann
161	INV-2026-1147	BRD-02		Alembic Pharmaceuticals Limited		+91 98257 88990	alembicpharmaceuticalslimited@corp.in	Alembic Road, Vadodara	24AAACA3344H1Z4	2026-07-30	\N	Admin		1	3	114696.00	20645.28	5734.80	0.00	129606.48	Bank Transfer	Posted			Admin	2026-10-24 09:37:40.149516+05:30	2026-10-24 09:37:40.149516+05:30	comp_mann
162	INV-2026-1148	BRD-02		Amul Dairy Technical Facilities		+91 98259 00112	amuldairytechnicalfacilities@corp.in	Anand Main Dairy Campus, Anand	24AAACA7788J1Z6	2026-07-30	\N	Admin		1	1	16815.00	3026.70	840.75	0.00	19000.95	Bank Transfer	Posted			Admin	2026-10-24 09:37:40.151296+05:30	2026-10-24 09:37:40.151296+05:30	comp_mann
163	INV-2026-1149	AMD-01		Shreeji Industrial Safety Systems		+91 98258 99001	shreejiindustrialsafetysystems@corp.in	GIDC Estate, Phase II, Halol	24AAACS5566I1Z0	2026-07-31	\N	Admin		1	1	58528.00	10535.04	2926.40	0.00	66136.64	Bank Transfer	Posted			Admin	2026-10-24 09:37:40.152442+05:30	2026-10-24 09:37:40.152442+05:30	comp_mann
164	INV-2026-1150	AMD-01		Tata Motors Manufacturing Plant		+91 98254 55667	tatamotorsmanufacturingplant@corp.in	GIDC Industrial Estate, Sanand	24AAACT3456D1Z7	2026-07-31	\N	Admin		1	3	128944.00	23209.92	6447.20	0.00	145706.72	Bank Transfer	Posted			Admin	2026-10-24 09:37:40.1544+05:30	2026-10-24 09:37:40.1544+05:30	comp_mann
165	INV-2026-1151	AMD-01		Tata Motors Manufacturing Plant		+91 98254 55667	tatamotorsmanufacturingplant@corp.in	GIDC Industrial Estate, Sanand	24AAACT3456D1Z7	2026-08-01	\N	Admin		1	2	499000.00	89820.00	24950.00	0.00	563870.00	UPI	Posted			Admin	2026-10-24 09:37:40.157389+05:30	2026-10-24 09:37:40.157389+05:30	comp_mann
166	INV-2026-1152	SRU-02		Gujarat State Fertilizers & Chemicals		+91 98256 77889	gujaratstatefertilizerschemicals@corp.in	Fertilizernagar, Vadodara	24AAACG1122G1Z8	2026-08-02	\N	Admin		1	1	5712.00	1028.16	0.00	0.00	6740.16	Bank Transfer	Posted			Admin	2026-10-24 09:37:40.158939+05:30	2026-10-24 09:37:40.158939+05:30	comp_mann
167	INV-2026-1153	AMD-01		Tata Motors Manufacturing Plant		+91 98254 55667	tatamotorsmanufacturingplant@corp.in	GIDC Industrial Estate, Sanand	24AAACT3456D1Z7	2026-08-03	\N	Admin		1	2	121572.80	21883.10	6078.64	0.00	137377.26	UPI	Posted			Admin	2026-10-24 09:37:40.160495+05:30	2026-10-24 09:37:40.160495+05:30	comp_mann
168	INV-2026-1154	AMD-01		Torrent Pharmaceuticals Ltd		+91 98252 33445	torrentpharmaceuticalsltd@corp.in	Indrad, Kadi, Mehsana	24AAACT5678B1Z9	2026-08-04	\N	Admin		1	3	59514.00	10712.52	2975.70	0.00	67250.82	Bank Transfer	Posted			Admin	2026-10-24 09:37:40.162473+05:30	2026-10-24 09:37:40.162473+05:30	comp_mann
169	INV-2026-1155	SRU-02		Torrent Pharmaceuticals Ltd		+91 98252 33445	torrentpharmaceuticalsltd@corp.in	Indrad, Kadi, Mehsana	24AAACT5678B1Z9	2026-08-04	\N	Admin		1	3	19411.10	3494.00	970.56	0.00	21934.54	Bank Transfer	Posted			Admin	2026-10-24 09:37:40.164733+05:30	2026-10-24 09:37:40.164733+05:30	comp_mann
170	INV-2026-1156	AMD-01		L&T Knowledge City Complex		+91 98253 44556	ltknowledgecitycomplex@corp.in	NH-8, Waghodia, Vadodara	24AAACL9012C1Z3	2026-08-04	\N	Admin		1	1	6490.00	1168.20	0.00	0.00	7658.20	UPI	Posted			Admin	2026-10-24 09:37:40.167201+05:30	2026-10-24 09:37:40.167201+05:30	comp_mann
171	INV-2026-1157	SRU-02		Zydus Lifesciences Biotech Park		+91 98255 66778	zyduslifesciencesbiotechpark@corp.in	Changodar, Ahmedabad	24AAACZ7890E1Z2	2026-08-05	\N	Admin		1	2	305632.00	55013.76	15281.60	0.00	345364.16	Bank Transfer	Posted			Admin	2026-10-24 09:37:40.169229+05:30	2026-10-24 09:37:40.169229+05:30	comp_mann
172	INV-2026-1158	AND-01		Alembic Pharmaceuticals Limited		+91 98257 88990	alembicpharmaceuticalslimited@corp.in	Alembic Road, Vadodara	24AAACA3344H1Z4	2026-08-06	\N	Admin		1	3	69022.00	12423.96	3451.10	0.00	77994.86	Bank Transfer	Posted			Admin	2026-10-24 09:37:40.171116+05:30	2026-10-24 09:37:40.171116+05:30	comp_mann
173	INV-2026-1159	AMD-01		Alembic Pharmaceuticals Limited		+91 98257 88990	alembicpharmaceuticalslimited@corp.in	Alembic Road, Vadodara	24AAACA3344H1Z4	2026-08-07	\N	Admin		1	1	191000.00	34380.00	9550.00	0.00	215830.00	UPI	Posted			Admin	2026-10-24 09:37:40.173507+05:30	2026-10-24 09:37:40.173507+05:30	comp_mann
174	INV-2026-1160	AMD-01		Reliance Industries Ltd (Hazira Complex)		+91 98251 22334	relianceindustriesltdhaziracomplex@corp.in	Hazira Industrial Area, Surat	24AAACR4321A1Z5	2026-08-09	\N	Admin		1	3	256668.00	46200.24	12833.40	0.00	290034.84	UPI	Posted			Admin	2026-10-24 09:37:40.174744+05:30	2026-10-24 09:37:40.174744+05:30	comp_mann
175	INV-2026-1161	AMD-01		Reliance Industries Ltd (Hazira Complex)		+91 98251 22334	relianceindustriesltdhaziracomplex@corp.in	Hazira Industrial Area, Surat	24AAACR4321A1Z5	2026-08-10	\N	Admin		1	2	47640.00	8575.20	2382.00	0.00	53833.20	Cash	Posted			Admin	2026-10-24 09:37:40.177787+05:30	2026-10-24 09:37:40.177787+05:30	comp_mann
176	INV-2026-1162	BRD-02		Gujarat State Fertilizers & Chemicals		+91 98256 77889	gujaratstatefertilizerschemicals@corp.in	Fertilizernagar, Vadodara	24AAACG1122G1Z8	2026-08-10	\N	Admin		1	2	12555.20	2259.94	0.00	0.00	14815.14	Bank Transfer	Posted			Admin	2026-10-24 09:37:40.179564+05:30	2026-10-24 09:37:40.179564+05:30	comp_mann
177	INV-2026-1163	SRU-02		Torrent Pharmaceuticals Ltd		+91 98252 33445	torrentpharmaceuticalsltd@corp.in	Indrad, Kadi, Mehsana	24AAACT5678B1Z9	2026-08-10	\N	Admin		1	2	49731.10	8951.60	2486.56	0.00	56196.14	UPI	Posted			Admin	2026-10-24 09:37:40.181046+05:30	2026-10-24 09:37:40.181046+05:30	comp_mann
178	INV-2026-1164	SRU-02		Alembic Pharmaceuticals Limited		+91 98257 88990	alembicpharmaceuticalslimited@corp.in	Alembic Road, Vadodara	24AAACA3344H1Z4	2026-08-11	\N	Admin		1	1	7392.00	1330.56	0.00	0.00	8722.56	Bank Transfer	Posted			Admin	2026-10-24 09:37:40.183159+05:30	2026-10-24 09:37:40.183159+05:30	comp_mann
179	INV-2026-1165	BRD-02		Alembic Pharmaceuticals Limited		+91 98257 88990	alembicpharmaceuticalslimited@corp.in	Alembic Road, Vadodara	24AAACA3344H1Z4	2026-08-11	\N	Admin		1	3	5563.70	1001.47	0.00	0.00	6565.17	Bank Transfer	Posted			Admin	2026-10-24 09:37:40.184796+05:30	2026-10-24 09:37:40.184796+05:30	comp_mann
180	INV-2026-1166	AMD-01		Torrent Pharmaceuticals Ltd		+91 98252 33445	torrentpharmaceuticalsltd@corp.in	Indrad, Kadi, Mehsana	24AAACT5678B1Z9	2026-08-12	\N	Admin		1	3	43011.00	7741.98	2150.55	0.00	48602.43	UPI	Posted			Admin	2026-10-24 09:37:40.187169+05:30	2026-10-24 09:37:40.187169+05:30	comp_mann
181	INV-2026-1167	SRU-02		Alembic Pharmaceuticals Limited		+91 98257 88990	alembicpharmaceuticalslimited@corp.in	Alembic Road, Vadodara	24AAACA3344H1Z4	2026-08-13	\N	Admin		1	2	198602.00	35748.36	9930.10	0.00	224420.26	UPI	Posted			Admin	2026-10-24 09:37:40.189406+05:30	2026-10-24 09:37:40.189406+05:30	comp_mann
182	INV-2026-1168	AMD-01		Reliance Industries Ltd (Hazira Complex)		+91 98251 22334	relianceindustriesltdhaziracomplex@corp.in	Hazira Industrial Area, Surat	24AAACR4321A1Z5	2026-08-13	\N	Admin		1	1	6490.00	1168.20	0.00	0.00	7658.20	Cash	Posted			Admin	2026-10-24 09:37:40.191477+05:30	2026-10-24 09:37:40.191477+05:30	comp_mann
183	INV-2026-1169	SRU-02		Torrent Pharmaceuticals Ltd		+91 98252 33445	torrentpharmaceuticalsltd@corp.in	Indrad, Kadi, Mehsana	24AAACT5678B1Z9	2026-08-14	\N	Admin		1	2	200088.00	36015.84	10004.40	0.00	226099.44	UPI	Posted			Admin	2026-10-24 09:37:40.192558+05:30	2026-10-24 09:37:40.192558+05:30	comp_mann
184	INV-2026-1170	BRD-02		Amul Dairy Technical Facilities		+91 98259 00112	amuldairytechnicalfacilities@corp.in	Anand Main Dairy Campus, Anand	24AAACA7788J1Z6	2026-08-15	\N	Admin		1	1	7375.00	1327.50	0.00	0.00	8702.50	Bank Transfer	Posted			Admin	2026-10-24 09:37:40.193881+05:30	2026-10-24 09:37:40.193881+05:30	comp_mann
185	INV-2026-1171	AMD-01		Alembic Pharmaceuticals Limited		+91 98257 88990	alembicpharmaceuticalslimited@corp.in	Alembic Road, Vadodara	24AAACA3344H1Z4	2026-08-17	\N	Admin		1	3	131893.20	23740.78	6594.66	0.00	149039.32	Cash	Posted			Admin	2026-10-24 09:37:40.195993+05:30	2026-10-24 09:37:40.195993+05:30	comp_mann
186	INV-2026-1172	AMD-01		Tata Motors Manufacturing Plant		+91 98254 55667	tatamotorsmanufacturingplant@corp.in	GIDC Industrial Estate, Sanand	24AAACT3456D1Z7	2026-08-18	\N	Admin		1	1	58528.00	10535.04	2926.40	0.00	66136.64	Bank Transfer	Posted			Admin	2026-10-24 09:37:40.19908+05:30	2026-10-24 09:37:40.19908+05:30	comp_mann
187	INV-2026-1173	SRU-02		Tata Motors Manufacturing Plant		+91 98254 55667	tatamotorsmanufacturingplant@corp.in	GIDC Industrial Estate, Sanand	24AAACT3456D1Z7	2026-08-18	\N	Admin		1	2	272300.00	49014.00	13615.00	0.00	307699.00	UPI	Posted			Admin	2026-10-24 09:37:40.200085+05:30	2026-10-24 09:37:40.200085+05:30	comp_mann
188	INV-2026-1174	AND-01		Adani Ports & Special Economic Zone		+91 98250 11223	adaniportsspecialeconomiczone@corp.in	Mundra Port SEZ, Kutch	24AAACA1234F1Z1	2026-08-19	\N	Admin		1	3	63732.00	11471.76	3186.60	0.00	72017.16	Bank Transfer	Posted			Admin	2026-10-24 09:37:40.20205+05:30	2026-10-24 09:37:40.20205+05:30	comp_mann
189	INV-2026-1175	BRD-02		Reliance Industries Ltd (Hazira Complex)		+91 98251 22334	relianceindustriesltdhaziracomplex@corp.in	Hazira Industrial Area, Surat	24AAACR4321A1Z5	2026-08-19	\N	Admin		1	2	130798.00	23543.64	6539.90	0.00	147801.74	UPI	Posted			Admin	2026-10-24 09:37:40.204736+05:30	2026-10-24 09:37:40.204736+05:30	comp_mann
190	INV-2026-1176	BRD-02		Alembic Pharmaceuticals Limited		+91 98257 88990	alembicpharmaceuticalslimited@corp.in	Alembic Road, Vadodara	24AAACA3344H1Z4	2026-08-19	\N	Admin		1	2	50544.00	9097.92	2527.20	0.00	57114.72	Card	Posted			Admin	2026-10-24 09:37:40.207193+05:30	2026-10-24 09:37:40.207193+05:30	comp_mann
191	INV-2026-1177	BRD-02		Gujarat State Fertilizers & Chemicals		+91 98256 77889	gujaratstatefertilizerschemicals@corp.in	Fertilizernagar, Vadodara	24AAACG1122G1Z8	2026-08-20	\N	Admin		1	1	2596.00	467.28	0.00	0.00	3063.28	Bank Transfer	Posted			Admin	2026-10-24 09:37:40.209906+05:30	2026-10-24 09:37:40.209906+05:30	comp_mann
192	INV-2026-1178	AMD-01		Zydus Lifesciences Biotech Park		+91 98255 66778	zyduslifesciencesbiotechpark@corp.in	Changodar, Ahmedabad	24AAACZ7890E1Z2	2026-08-20	\N	Admin		1	3	674952.00	121491.36	33747.60	0.00	762695.76	UPI	Posted			Admin	2026-10-24 09:37:40.211805+05:30	2026-10-24 09:37:40.211805+05:30	comp_mann
193	INV-2026-1179	AND-01		Gujarat State Fertilizers & Chemicals		+91 98256 77889	gujaratstatefertilizerschemicals@corp.in	Fertilizernagar, Vadodara	24AAACG1122G1Z8	2026-08-21	\N	Admin		1	2	22420.00	4035.60	1121.00	0.00	25334.60	Bank Transfer	Posted			Admin	2026-10-24 09:37:40.213824+05:30	2026-10-24 09:37:40.213824+05:30	comp_mann
194	INV-2026-1180	AMD-01		Reliance Industries Ltd (Hazira Complex)		+91 98251 22334	relianceindustriesltdhaziracomplex@corp.in	Hazira Industrial Area, Surat	24AAACR4321A1Z5	2026-08-21	\N	Admin		1	3	286892.00	51640.56	14344.60	0.00	324187.96	UPI	Posted			Admin	2026-10-24 09:37:40.216019+05:30	2026-10-24 09:37:40.216019+05:30	comp_mann
195	INV-2026-1181	AND-01		Amul Dairy Technical Facilities		+91 98259 00112	amuldairytechnicalfacilities@corp.in	Anand Main Dairy Campus, Anand	24AAACA7788J1Z6	2026-08-21	\N	Admin		1	1	6664.00	1199.52	0.00	0.00	7863.52	Bank Transfer	Posted			Admin	2026-10-24 09:37:40.221034+05:30	2026-10-24 09:37:40.221034+05:30	comp_mann
196	INV-2026-1182	AMD-01		L&T Knowledge City Complex		+91 98253 44556	ltknowledgecitycomplex@corp.in	NH-8, Waghodia, Vadodara	24AAACL9012C1Z3	2026-08-24	\N	Admin		1	3	33607.00	6049.26	1680.35	0.00	37975.91	UPI	Posted			Admin	2026-10-24 09:37:40.222753+05:30	2026-10-24 09:37:40.222753+05:30	comp_mann
197	INV-2026-1183	SRU-02		Torrent Pharmaceuticals Ltd		+91 98252 33445	torrentpharmaceuticalsltd@corp.in	Indrad, Kadi, Mehsana	24AAACT5678B1Z9	2026-08-25	\N	Admin		1	2	22124.00	3982.32	1106.20	0.00	25000.12	UPI	Posted			Admin	2026-10-24 09:37:40.227659+05:30	2026-10-24 09:37:40.227659+05:30	comp_mann
198	INV-2026-1184	AMD-01		Gujarat State Fertilizers & Chemicals		+91 98256 77889	gujaratstatefertilizerschemicals@corp.in	Fertilizernagar, Vadodara	24AAACG1122G1Z8	2026-08-26	\N	Admin		1	2	38904.00	7002.72	1945.20	0.00	43961.52	Bank Transfer	Posted			Admin	2026-10-24 09:37:40.230304+05:30	2026-10-24 09:37:40.230304+05:30	comp_mann
199	INV-2026-1185	AMD-01		Tata Motors Manufacturing Plant		+91 98254 55667	tatamotorsmanufacturingplant@corp.in	GIDC Industrial Estate, Sanand	24AAACT3456D1Z7	2026-08-26	\N	Admin		1	2	11092.00	1996.56	0.00	0.00	13088.56	Card	Posted			Admin	2026-10-24 09:37:40.232947+05:30	2026-10-24 09:37:40.232947+05:30	comp_mann
200	INV-2026-1186	AMD-01		Reliance Industries Ltd (Hazira Complex)		+91 98251 22334	relianceindustriesltdhaziracomplex@corp.in	Hazira Industrial Area, Surat	24AAACR4321A1Z5	2026-08-27	\N	Admin		1	1	14504.00	2610.72	0.00	0.00	17114.72	Cash	Posted			Admin	2026-10-24 09:37:40.237138+05:30	2026-10-24 09:37:40.237138+05:30	comp_mann
201	INV-2026-1187	AND-01		Gujarat State Fertilizers & Chemicals		+91 98256 77889	gujaratstatefertilizerschemicals@corp.in	Fertilizernagar, Vadodara	24AAACG1122G1Z8	2026-08-28	\N	Admin		1	3	15918.20	2865.28	795.91	0.00	17987.57	Cash	Posted			Admin	2026-10-24 09:37:40.239697+05:30	2026-10-24 09:37:40.239697+05:30	comp_mann
202	INV-2026-1188	AMD-01		Gujarat State Fertilizers & Chemicals		+91 98256 77889	gujaratstatefertilizerschemicals@corp.in	Fertilizernagar, Vadodara	24AAACG1122G1Z8	2026-08-31	\N	Admin		1	3	144325.60	25978.61	7216.28	0.00	163087.93	UPI	Posted			Admin	2026-10-24 09:37:40.243022+05:30	2026-10-24 09:37:40.243022+05:30	comp_mann
203	INV-2026-1189	SRU-02		Amul Dairy Technical Facilities		+91 98259 00112	amuldairytechnicalfacilities@corp.in	Anand Main Dairy Campus, Anand	24AAACA7788J1Z6	2026-08-31	\N	Admin		1	2	36848.00	6632.64	1842.40	0.00	41638.24	Bank Transfer	Posted			Admin	2026-10-24 09:37:40.248427+05:30	2026-10-24 09:37:40.248427+05:30	comp_mann
204	INV-2026-1190	AMD-01		Zydus Lifesciences Biotech Park		+91 98255 66778	zyduslifesciencesbiotechpark@corp.in	Changodar, Ahmedabad	24AAACZ7890E1Z2	2026-08-31	\N	Admin		1	1	2072.00	372.96	0.00	0.00	2444.96	Card	Posted			Admin	2026-10-24 09:37:40.250931+05:30	2026-10-24 09:37:40.250931+05:30	comp_mann
205	INV-2026-1191	AMD-01		Tata Motors Manufacturing Plant		+91 98254 55667	tatamotorsmanufacturingplant@corp.in	GIDC Industrial Estate, Sanand	24AAACT3456D1Z7	2026-09-01	\N	Admin		1	3	21185.60	3813.41	1059.28	0.00	23939.73	Bank Transfer	Posted			Admin	2026-10-24 09:37:40.253958+05:30	2026-10-24 09:37:40.253958+05:30	comp_mann
206	INV-2026-1192	BRD-02		Gujarat State Fertilizers & Chemicals		+91 98256 77889	gujaratstatefertilizerschemicals@corp.in	Fertilizernagar, Vadodara	24AAACG1122G1Z8	2026-09-02	\N	Admin		1	3	19234.00	3462.12	961.70	0.00	21734.42	Cash	Posted			Admin	2026-10-24 09:37:40.257901+05:30	2026-10-24 09:37:40.257901+05:30	comp_mann
207	INV-2026-1193	AMD-01		Reliance Industries Ltd (Hazira Complex)		+91 98251 22334	relianceindustriesltdhaziracomplex@corp.in	Hazira Industrial Area, Surat	24AAACR4321A1Z5	2026-09-02	\N	Admin		1	3	27741.80	4993.52	1387.09	0.00	31348.23	Cash	Posted			Admin	2026-10-24 09:37:40.261764+05:30	2026-10-24 09:37:40.261764+05:30	comp_mann
208	INV-2026-1194	AMD-01		Shreeji Industrial Safety Systems		+91 98258 99001	shreejiindustrialsafetysystems@corp.in	GIDC Estate, Phase II, Halol	24AAACS5566I1Z0	2026-09-03	\N	Admin		1	2	761192.00	137014.56	38059.60	0.00	860146.96	Bank Transfer	Posted			Admin	2026-10-24 09:37:40.268604+05:30	2026-10-24 09:37:40.268604+05:30	comp_mann
209	INV-2026-1195	SRU-02		L&T Knowledge City Complex		+91 98253 44556	ltknowledgecitycomplex@corp.in	NH-8, Waghodia, Vadodara	24AAACL9012C1Z3	2026-09-03	\N	Admin		1	1	4602.00	828.36	0.00	0.00	5430.36	Cash	Posted			Admin	2026-10-24 09:37:40.27198+05:30	2026-10-24 09:37:40.27198+05:30	comp_mann
210	INV-2026-1196	BRD-02		Gujarat State Fertilizers & Chemicals		+91 98256 77889	gujaratstatefertilizerschemicals@corp.in	Fertilizernagar, Vadodara	24AAACG1122G1Z8	2026-09-04	\N	Admin		1	1	14784.00	2661.12	0.00	0.00	17445.12	UPI	Posted			Admin	2026-10-24 09:37:40.275019+05:30	2026-10-24 09:37:40.275019+05:30	comp_mann
211	INV-2026-1197	AMD-01		Reliance Industries Ltd (Hazira Complex)		+91 98251 22334	relianceindustriesltdhaziracomplex@corp.in	Hazira Industrial Area, Surat	24AAACR4321A1Z5	2026-09-07	\N	Admin		1	3	654640.00	117835.20	32732.00	0.00	739743.20	Cash	Posted			Admin	2026-10-24 09:37:40.276969+05:30	2026-10-24 09:37:40.276969+05:30	comp_mann
212	INV-2026-1198	SRU-02		Reliance Industries Ltd (Hazira Complex)		+91 98251 22334	relianceindustriesltdhaziracomplex@corp.in	Hazira Industrial Area, Surat	24AAACR4321A1Z5	2026-09-08	\N	Admin		1	3	318050.00	57249.00	15902.50	0.00	359396.50	Bank Transfer	Posted			Admin	2026-10-24 09:37:40.281165+05:30	2026-10-24 09:37:40.281165+05:30	comp_mann
213	INV-2026-1199	AMD-01		Torrent Pharmaceuticals Ltd		+91 98252 33445	torrentpharmaceuticalsltd@corp.in	Indrad, Kadi, Mehsana	24AAACT5678B1Z9	2026-09-08	\N	Admin		1	1	305600.00	55008.00	15280.00	0.00	345328.00	Card	Posted			Admin	2026-10-24 09:37:40.284195+05:30	2026-10-24 09:37:40.284195+05:30	comp_mann
214	INV-2026-1200	AMD-01		Torrent Pharmaceuticals Ltd		+91 98252 33445	torrentpharmaceuticalsltd@corp.in	Indrad, Kadi, Mehsana	24AAACT5678B1Z9	2026-09-08	\N	Admin		1	3	277136.00	49884.48	13856.80	0.00	313163.68	Bank Transfer	Posted			Admin	2026-10-24 09:37:40.286367+05:30	2026-10-24 09:37:40.286367+05:30	comp_mann
215	INV-2026-1201	BRD-02		Gujarat State Fertilizers & Chemicals		+91 98256 77889	gujaratstatefertilizerschemicals@corp.in	Fertilizernagar, Vadodara	24AAACG1122G1Z8	2026-09-09	\N	Admin		1	1	29700.00	5346.00	1485.00	0.00	33561.00	UPI	Posted			Admin	2026-10-24 09:37:40.29106+05:30	2026-10-24 09:37:40.29106+05:30	comp_mann
216	INV-2026-1202	AMD-01		Shreeji Industrial Safety Systems		+91 98258 99001	shreejiindustrialsafetysystems@corp.in	GIDC Estate, Phase II, Halol	24AAACS5566I1Z0	2026-09-09	\N	Admin		1	2	199192.00	35854.56	9959.60	0.00	225086.96	UPI	Posted			Admin	2026-10-24 09:37:40.292984+05:30	2026-10-24 09:37:40.292984+05:30	comp_mann
217	INV-2026-1203	AND-01		Gujarat State Fertilizers & Chemicals		+91 98256 77889	gujaratstatefertilizerschemicals@corp.in	Fertilizernagar, Vadodara	24AAACG1122G1Z8	2026-09-10	\N	Admin		1	1	34650.00	6237.00	1732.50	0.00	39154.50	Cash	Posted			Admin	2026-10-24 09:37:40.29552+05:30	2026-10-24 09:37:40.29552+05:30	comp_mann
218	INV-2026-1204	AND-01		Alembic Pharmaceuticals Limited		+91 98257 88990	alembicpharmaceuticalslimited@corp.in	Alembic Road, Vadodara	24AAACA3344H1Z4	2026-09-11	\N	Admin		1	2	5976.60	1075.79	0.00	0.00	7052.39	Cash	Posted			Admin	2026-10-24 09:37:40.297827+05:30	2026-10-24 09:37:40.297827+05:30	comp_mann
219	INV-2026-1205	BRD-02		Shreeji Industrial Safety Systems		+91 98258 99001	shreejiindustrialsafetysystems@corp.in	GIDC Estate, Phase II, Halol	24AAACS5566I1Z0	2026-09-12	\N	Admin		1	3	56052.00	10089.36	2802.60	0.00	63338.76	Bank Transfer	Posted			Admin	2026-10-24 09:37:40.300767+05:30	2026-10-24 09:37:40.300767+05:30	comp_mann
220	INV-2026-1206	AMD-01		Reliance Industries Ltd (Hazira Complex)		+91 98251 22334	relianceindustriesltdhaziracomplex@corp.in	Hazira Industrial Area, Surat	24AAACR4321A1Z5	2026-09-13	\N	Admin		1	2	578088.00	104055.84	28904.40	0.00	653239.44	Cash	Posted			Admin	2026-10-24 09:37:40.304418+05:30	2026-10-24 09:37:40.304418+05:30	comp_mann
221	INV-2026-1207	SRU-02		Amul Dairy Technical Facilities		+91 98259 00112	amuldairytechnicalfacilities@corp.in	Anand Main Dairy Campus, Anand	24AAACA7788J1Z6	2026-09-14	\N	Admin		1	2	567342.20	102121.60	28367.11	0.00	641096.69	Card	Posted			Admin	2026-10-24 09:37:40.307188+05:30	2026-10-24 09:37:40.307188+05:30	comp_mann
222	INV-2026-1208	AMD-01		Tata Motors Manufacturing Plant		+91 98254 55667	tatamotorsmanufacturingplant@corp.in	GIDC Industrial Estate, Sanand	24AAACT3456D1Z7	2026-09-14	\N	Admin		1	1	7316.00	1316.88	0.00	0.00	8632.88	Cash	Posted			Admin	2026-10-24 09:37:40.309673+05:30	2026-10-24 09:37:40.309673+05:30	comp_mann
223	INV-2026-1209	SRU-02		Shreeji Industrial Safety Systems		+91 98258 99001	shreejiindustrialsafetysystems@corp.in	GIDC Estate, Phase II, Halol	24AAACS5566I1Z0	2026-09-14	\N	Admin		1	1	49560.00	8920.80	2478.00	0.00	56002.80	Cash	Posted			Admin	2026-10-24 09:37:40.311359+05:30	2026-10-24 09:37:40.311359+05:30	comp_mann
224	INV-2026-1210	AMD-01		Amul Dairy Technical Facilities		+91 98259 00112	amuldairytechnicalfacilities@corp.in	Anand Main Dairy Campus, Anand	24AAACA7788J1Z6	2026-09-15	\N	Admin		1	1	55500.00	9990.00	2775.00	0.00	62715.00	Bank Transfer	Posted			Admin	2026-10-24 09:37:40.313599+05:30	2026-10-24 09:37:40.313599+05:30	comp_mann
225	INV-2026-1211	BRD-02		Gujarat State Fertilizers & Chemicals		+91 98256 77889	gujaratstatefertilizerschemicals@corp.in	Fertilizernagar, Vadodara	24AAACG1122G1Z8	2026-09-15	\N	Admin		1	1	4602.00	828.36	0.00	0.00	5430.36	UPI	Posted			Admin	2026-10-24 09:37:40.316751+05:30	2026-10-24 09:37:40.316751+05:30	comp_mann
226	INV-2026-1212	AMD-01		Shreeji Industrial Safety Systems		+91 98258 99001	shreejiindustrialsafetysystems@corp.in	GIDC Estate, Phase II, Halol	24AAACS5566I1Z0	2026-09-15	\N	Admin		1	3	346696.00	62405.28	17334.80	0.00	391766.48	UPI	Posted			Admin	2026-10-24 09:37:40.318514+05:30	2026-10-24 09:37:40.318514+05:30	comp_mann
227	INV-2026-1213	SRU-02		L&T Knowledge City Complex		+91 98253 44556	ltknowledgecitycomplex@corp.in	NH-8, Waghodia, Vadodara	24AAACL9012C1Z3	2026-09-16	\N	Admin		1	3	503020.00	90543.60	25151.00	0.00	568412.60	Bank Transfer	Posted			Admin	2026-10-24 09:37:40.322569+05:30	2026-10-24 09:37:40.322569+05:30	comp_mann
228	INV-2026-1214	AMD-01		Alembic Pharmaceuticals Limited		+91 98257 88990	alembicpharmaceuticalslimited@corp.in	Alembic Road, Vadodara	24AAACA3344H1Z4	2026-09-17	\N	Admin		1	3	50470.00	9084.60	2523.50	0.00	57031.10	UPI	Posted			Admin	2026-10-24 09:37:40.325512+05:30	2026-10-24 09:37:40.325512+05:30	comp_mann
229	INV-2026-1215	SRU-02		Alembic Pharmaceuticals Limited		+91 98257 88990	alembicpharmaceuticalslimited@corp.in	Alembic Road, Vadodara	24AAACA3344H1Z4	2026-09-18	\N	Admin		1	1	10089.00	1816.02	0.00	0.00	11905.02	Cash	Posted			Admin	2026-10-24 09:37:40.329289+05:30	2026-10-24 09:37:40.329289+05:30	comp_mann
230	INV-2026-1216	SRU-02		Torrent Pharmaceuticals Ltd		+91 98252 33445	torrentpharmaceuticalsltd@corp.in	Indrad, Kadi, Mehsana	24AAACT5678B1Z9	2026-09-19	\N	Admin		1	2	6273.00	1129.14	0.00	0.00	7402.14	UPI	Posted			Admin	2026-10-24 09:37:40.33276+05:30	2026-10-24 09:37:40.33276+05:30	comp_mann
231	INV-2026-1217	SRU-02		Reliance Industries Ltd (Hazira Complex)		+91 98251 22334	relianceindustriesltdhaziracomplex@corp.in	Hazira Industrial Area, Surat	24AAACR4321A1Z5	2026-09-20	\N	Admin		1	2	201080.00	36194.40	10054.00	0.00	227220.40	UPI	Posted			Admin	2026-10-24 09:37:40.335558+05:30	2026-10-24 09:37:40.335558+05:30	comp_mann
232	INV-2026-1218	AMD-01		Adani Ports & Special Economic Zone		+91 98250 11223	adaniportsspecialeconomiczone@corp.in	Mundra Port SEZ, Kutch	24AAACA1234F1Z1	2026-09-21	\N	Admin		1	3	28251.60	5085.29	1412.58	0.00	31924.31	Cash	Posted			Admin	2026-10-24 09:37:40.338203+05:30	2026-10-24 09:37:40.338203+05:30	comp_mann
233	INV-2026-1219	AMD-01		Adani Ports & Special Economic Zone		+91 98250 11223	adaniportsspecialeconomiczone@corp.in	Mundra Port SEZ, Kutch	24AAACA1234F1Z1	2026-09-22	\N	Admin		1	1	14784.00	2661.12	0.00	0.00	17445.12	Bank Transfer	Posted			Admin	2026-10-24 09:37:40.34175+05:30	2026-10-24 09:37:40.34175+05:30	comp_mann
234	INV-2026-1220	AND-01		Zydus Lifesciences Biotech Park		+91 98255 66778	zyduslifesciencesbiotechpark@corp.in	Changodar, Ahmedabad	24AAACZ7890E1Z2	2026-09-22	\N	Admin		1	1	58528.00	10535.04	2926.40	0.00	66136.64	Cash	Posted			Admin	2026-10-24 09:37:40.344078+05:30	2026-10-24 09:37:40.344078+05:30	comp_mann
235	INV-2026-1221	BRD-02		Alembic Pharmaceuticals Limited		+91 98257 88990	alembicpharmaceuticalslimited@corp.in	Alembic Road, Vadodara	24AAACA3344H1Z4	2026-09-22	\N	Admin		1	3	42706.00	7687.08	2135.30	0.00	48257.78	Card	Posted			Admin	2026-10-24 09:37:40.346289+05:30	2026-10-24 09:37:40.346289+05:30	comp_mann
236	INV-2026-1222	BRD-02		Shreeji Industrial Safety Systems		+91 98258 99001	shreejiindustrialsafetysystems@corp.in	GIDC Estate, Phase II, Halol	24AAACS5566I1Z0	2026-09-23	\N	Admin		1	2	16465.20	2963.74	823.26	0.00	18605.68	Cash	Posted			Admin	2026-10-24 09:37:40.34999+05:30	2026-10-24 09:37:40.34999+05:30	comp_mann
237	INV-2026-1223	BRD-02		Shreeji Industrial Safety Systems		+91 98258 99001	shreejiindustrialsafetysystems@corp.in	GIDC Estate, Phase II, Halol	24AAACS5566I1Z0	2026-09-23	\N	Admin		1	3	400384.60	72069.23	20019.23	0.00	452434.60	Cash	Posted			Admin	2026-10-24 09:37:40.35247+05:30	2026-10-24 09:37:40.35247+05:30	comp_mann
238	INV-2026-1224	SRU-02		Shreeji Industrial Safety Systems		+91 98258 99001	shreejiindustrialsafetysystems@corp.in	GIDC Estate, Phase II, Halol	24AAACS5566I1Z0	2026-09-24	\N	Admin		1	3	50327.00	9058.86	2516.35	0.00	56869.51	UPI	Posted			Admin	2026-10-24 09:37:40.356166+05:30	2026-10-24 09:37:40.356166+05:30	comp_mann
239	INV-2026-1225	BRD-02		Zydus Lifesciences Biotech Park		+91 98255 66778	zyduslifesciencesbiotechpark@corp.in	Changodar, Ahmedabad	24AAACZ7890E1Z2	2026-09-24	\N	Admin		1	2	47668.00	8580.24	2383.40	0.00	53864.84	Cash	Posted			Admin	2026-10-24 09:37:40.359845+05:30	2026-10-24 09:37:40.359845+05:30	comp_mann
240	INV-2026-1226	AMD-01		Tata Motors Manufacturing Plant		+91 98254 55667	tatamotorsmanufacturingplant@corp.in	GIDC Industrial Estate, Sanand	24AAACT3456D1Z7	2026-09-25	\N	Admin		1	3	11245.70	2024.23	0.00	0.00	13269.93	Bank Transfer	Posted			Admin	2026-10-24 09:37:40.362849+05:30	2026-10-24 09:37:40.362849+05:30	comp_mann
241	INV-2026-1227	SRU-02		Adani Ports & Special Economic Zone		+91 98250 11223	adaniportsspecialeconomiczone@corp.in	Mundra Port SEZ, Kutch	24AAACA1234F1Z1	2026-09-27	\N	Admin		1	2	11081.00	1994.58	0.00	0.00	13075.58	Bank Transfer	Posted			Admin	2026-10-24 09:37:40.366325+05:30	2026-10-24 09:37:40.366325+05:30	comp_mann
242	INV-2026-1228	AMD-01		Gujarat State Fertilizers & Chemicals		+91 98256 77889	gujaratstatefertilizerschemicals@corp.in	Fertilizernagar, Vadodara	24AAACG1122G1Z8	2026-09-28	\N	Admin		1	2	50512.00	9092.16	2525.60	0.00	57078.56	Bank Transfer	Posted			Admin	2026-10-24 09:37:40.369293+05:30	2026-10-24 09:37:40.369293+05:30	comp_mann
243	INV-2026-1229	BRD-02		Zydus Lifesciences Biotech Park		+91 98255 66778	zyduslifesciencesbiotechpark@corp.in	Changodar, Ahmedabad	24AAACZ7890E1Z2	2026-09-29	\N	Admin		1	1	3696.00	665.28	0.00	0.00	4361.28	UPI	Posted			Admin	2026-10-24 09:37:40.372332+05:30	2026-10-24 09:37:40.372332+05:30	comp_mann
244	INV-2026-1230	SRU-02		L&T Knowledge City Complex		+91 98253 44556	ltknowledgecitycomplex@corp.in	NH-8, Waghodia, Vadodara	24AAACL9012C1Z3	2026-09-29	\N	Admin		1	1	2891.00	520.38	0.00	0.00	3411.38	UPI	Posted			Admin	2026-10-24 09:37:40.374868+05:30	2026-10-24 09:37:40.374868+05:30	comp_mann
245	INV-2026-1231	AND-01		Amul Dairy Technical Facilities		+91 98259 00112	amuldairytechnicalfacilities@corp.in	Anand Main Dairy Campus, Anand	24AAACA7788J1Z6	2026-09-30	\N	Admin		1	2	53097.00	9557.46	2654.85	0.00	59999.61	UPI	Posted			Admin	2026-10-24 09:37:40.378832+05:30	2026-10-24 09:37:40.378832+05:30	comp_mann
246	INV-2026-1232	AMD-01		Reliance Industries Ltd (Hazira Complex)		+91 98251 22334	relianceindustriesltdhaziracomplex@corp.in	Hazira Industrial Area, Surat	24AAACR4321A1Z5	2026-09-30	\N	Admin		1	3	35634.60	6414.23	1781.73	0.00	40267.10	Bank Transfer	Posted			Admin	2026-10-24 09:37:40.381291+05:30	2026-10-24 09:37:40.381291+05:30	comp_mann
247	INV-2026-1233	AMD-01		Shreeji Industrial Safety Systems		+91 98258 99001	shreejiindustrialsafetysystems@corp.in	GIDC Estate, Phase II, Halol	24AAACS5566I1Z0	2026-10-01	\N	Admin		1	2	48048.00	8648.64	2402.40	0.00	54294.24	Bank Transfer	Posted			Admin	2026-10-24 09:37:40.384369+05:30	2026-10-24 09:37:40.384369+05:30	comp_mann
248	INV-2026-1234	AMD-01		Zydus Lifesciences Biotech Park		+91 98255 66778	zyduslifesciencesbiotechpark@corp.in	Changodar, Ahmedabad	24AAACZ7890E1Z2	2026-10-02	\N	Admin		1	1	7375.00	1327.50	0.00	0.00	8702.50	UPI	Posted			Admin	2026-10-24 09:37:40.387192+05:30	2026-10-24 09:37:40.387192+05:30	comp_mann
249	INV-2026-1235	SRU-02		Tata Motors Manufacturing Plant		+91 98254 55667	tatamotorsmanufacturingplant@corp.in	GIDC Industrial Estate, Sanand	24AAACT3456D1Z7	2026-10-02	\N	Admin		1	2	62955.00	11331.90	3147.75	0.00	71139.15	Bank Transfer	Posted			Admin	2026-10-24 09:37:40.388371+05:30	2026-10-24 09:37:40.388371+05:30	comp_mann
250	INV-2026-1236	AMD-01		Gujarat State Fertilizers & Chemicals		+91 98256 77889	gujaratstatefertilizerschemicals@corp.in	Fertilizernagar, Vadodara	24AAACG1122G1Z8	2026-10-05	\N	Admin		1	3	39874.40	7177.39	1993.72	0.00	45058.07	Cash	Posted			Admin	2026-10-24 09:37:40.390773+05:30	2026-10-24 09:37:40.390773+05:30	comp_mann
251	INV-2026-1237	AMD-01		Adani Ports & Special Economic Zone		+91 98250 11223	adaniportsspecialeconomiczone@corp.in	Mundra Port SEZ, Kutch	24AAACA1234F1Z1	2026-10-06	\N	Admin		1	1	567000.00	102060.00	28350.00	0.00	640710.00	Bank Transfer	Posted			Admin	2026-10-24 09:37:40.393628+05:30	2026-10-24 09:37:40.393628+05:30	comp_mann
252	INV-2026-1238	AMD-01		Tata Motors Manufacturing Plant		+91 98254 55667	tatamotorsmanufacturingplant@corp.in	GIDC Industrial Estate, Sanand	24AAACT3456D1Z7	2026-10-06	\N	Admin		1	3	26550.00	4779.00	1327.50	0.00	30001.50	Bank Transfer	Posted			Admin	2026-10-24 09:37:40.395123+05:30	2026-10-24 09:37:40.395123+05:30	comp_mann
253	INV-2026-1239	SRU-02		Amul Dairy Technical Facilities		+91 98259 00112	amuldairytechnicalfacilities@corp.in	Anand Main Dairy Campus, Anand	24AAACA7788J1Z6	2026-10-07	\N	Admin		1	2	65844.00	11851.92	3292.20	0.00	74403.72	UPI	Posted			Admin	2026-10-24 09:37:40.397447+05:30	2026-10-24 09:37:40.397447+05:30	comp_mann
254	INV-2026-1240	BRD-02		Shreeji Industrial Safety Systems		+91 98258 99001	shreejiindustrialsafetysystems@corp.in	GIDC Estate, Phase II, Halol	24AAACS5566I1Z0	2026-10-08	\N	Admin		1	3	94112.00	16940.16	4705.60	0.00	106346.56	Card	Posted			Admin	2026-10-24 09:37:40.39993+05:30	2026-10-24 09:37:40.39993+05:30	comp_mann
255	INV-2026-1241	AND-01		Adani Ports & Special Economic Zone		+91 98250 11223	adaniportsspecialeconomiczone@corp.in	Mundra Port SEZ, Kutch	24AAACA1234F1Z1	2026-10-09	\N	Admin		1	3	75264.00	13547.52	3763.20	0.00	85048.32	UPI	Posted			Admin	2026-10-24 09:37:40.402604+05:30	2026-10-24 09:37:40.402604+05:30	comp_mann
256	INV-2026-1242	AMD-01		Tata Motors Manufacturing Plant		+91 98254 55667	tatamotorsmanufacturingplant@corp.in	GIDC Industrial Estate, Sanand	24AAACT3456D1Z7	2026-10-09	\N	Admin		1	3	25724.00	4630.32	1286.20	0.00	29068.12	Bank Transfer	Posted			Admin	2026-10-24 09:37:40.404646+05:30	2026-10-24 09:37:40.404646+05:30	comp_mann
257	INV-2026-1243	AND-01		Zydus Lifesciences Biotech Park		+91 98255 66778	zyduslifesciencesbiotechpark@corp.in	Changodar, Ahmedabad	24AAACZ7890E1Z2	2026-10-11	\N	Admin		1	2	237896.00	42821.28	11894.80	0.00	268822.48	UPI	Posted			Admin	2026-10-24 09:37:40.407709+05:30	2026-10-24 09:37:40.407709+05:30	comp_mann
258	INV-2026-1244	AMD-01		Alembic Pharmaceuticals Limited		+91 98257 88990	alembicpharmaceuticalslimited@corp.in	Alembic Road, Vadodara	24AAACA3344H1Z4	2026-10-12	\N	Admin		1	3	198616.00	35750.88	9930.80	0.00	224436.08	UPI	Posted			Admin	2026-10-24 09:37:40.409212+05:30	2026-10-24 09:37:40.409212+05:30	comp_mann
259	INV-2026-1245	SRU-02		Torrent Pharmaceuticals Ltd		+91 98252 33445	torrentpharmaceuticalsltd@corp.in	Indrad, Kadi, Mehsana	24AAACT5678B1Z9	2026-10-12	\N	Admin		1	3	11707.00	2107.26	0.00	0.00	13814.26	UPI	Posted			Admin	2026-10-24 09:37:40.411166+05:30	2026-10-24 09:37:40.411166+05:30	comp_mann
260	INV-2026-1246	BRD-02		Shreeji Industrial Safety Systems		+91 98258 99001	shreejiindustrialsafetysystems@corp.in	GIDC Estate, Phase II, Halol	24AAACS5566I1Z0	2026-10-13	\N	Admin		1	1	19800.00	3564.00	990.00	0.00	22374.00	Card	Posted			Admin	2026-10-24 09:37:40.414578+05:30	2026-10-24 09:37:40.414578+05:30	comp_mann
261	INV-2026-1247	AMD-01		Torrent Pharmaceuticals Ltd		+91 98252 33445	torrentpharmaceuticalsltd@corp.in	Indrad, Kadi, Mehsana	24AAACT5678B1Z9	2026-10-13	\N	Admin		1	3	30090.00	5416.20	1504.50	0.00	34001.70	UPI	Posted			Admin	2026-10-24 09:37:40.415697+05:30	2026-10-24 09:37:40.415697+05:30	comp_mann
262	INV-2026-1248	AND-01		L&T Knowledge City Complex		+91 98253 44556	ltknowledgecitycomplex@corp.in	NH-8, Waghodia, Vadodara	24AAACL9012C1Z3	2026-10-13	\N	Admin		1	1	79296.00	14273.28	3964.80	0.00	89604.48	UPI	Posted			Admin	2026-10-24 09:37:40.418152+05:30	2026-10-24 09:37:40.418152+05:30	comp_mann
263	INV-2026-1249	BRD-02		Reliance Industries Ltd (Hazira Complex)		+91 98251 22334	relianceindustriesltdhaziracomplex@corp.in	Hazira Industrial Area, Surat	24AAACR4321A1Z5	2026-10-14	\N	Admin		1	3	24780.00	4460.40	1239.00	0.00	28001.40	Bank Transfer	Posted			Admin	2026-10-24 09:37:40.420174+05:30	2026-10-24 09:37:40.420174+05:30	comp_mann
264	INV-2026-1250	AMD-01		Torrent Pharmaceuticals Ltd		+91 98252 33445	torrentpharmaceuticalsltd@corp.in	Indrad, Kadi, Mehsana	24AAACT5678B1Z9	2026-10-14	\N	Admin		1	1	3068.00	552.24	0.00	0.00	3620.24	UPI	Posted			Admin	2026-10-24 09:37:40.422223+05:30	2026-10-24 09:37:40.422223+05:30	comp_mann
265	INV-2026-1251	BRD-02		Alembic Pharmaceuticals Limited		+91 98257 88990	alembicpharmaceuticalslimited@corp.in	Alembic Road, Vadodara	24AAACA3344H1Z4	2026-10-15	\N	Admin		1	2	15576.00	2803.68	778.80	0.00	17600.88	UPI	Posted			Admin	2026-10-24 09:37:40.42368+05:30	2026-10-24 09:37:40.42368+05:30	comp_mann
266	INV-2026-1252	AMD-01		Shreeji Industrial Safety Systems		+91 98258 99001	shreejiindustrialsafetysystems@corp.in	GIDC Estate, Phase II, Halol	24AAACS5566I1Z0	2026-10-15	\N	Admin		1	3	51840.00	9331.20	2592.00	0.00	58579.20	Bank Transfer	Posted			Admin	2026-10-24 09:37:40.426322+05:30	2026-10-24 09:37:40.426322+05:30	comp_mann
267	INV-2026-1253	BRD-02		L&T Knowledge City Complex		+91 98253 44556	ltknowledgecitycomplex@corp.in	NH-8, Waghodia, Vadodara	24AAACL9012C1Z3	2026-10-15	\N	Admin		1	1	11564.00	2081.52	0.00	0.00	13645.52	Bank Transfer	Posted			Admin	2026-10-24 09:37:40.428565+05:30	2026-10-24 09:37:40.428565+05:30	comp_mann
268	INV-2026-1254	AMD-01		Gujarat State Fertilizers & Chemicals		+91 98256 77889	gujaratstatefertilizerschemicals@corp.in	Fertilizernagar, Vadodara	24AAACG1122G1Z8	2026-10-16	\N	Admin		1	2	10679.00	1922.22	0.00	0.00	12601.22	Bank Transfer	Posted			Admin	2026-10-24 09:37:40.429646+05:30	2026-10-24 09:37:40.429646+05:30	comp_mann
269	INV-2026-1255	AND-01		Torrent Pharmaceuticals Ltd		+91 98252 33445	torrentpharmaceuticalsltd@corp.in	Indrad, Kadi, Mehsana	24AAACT5678B1Z9	2026-10-16	\N	Admin		1	1	29200.00	5256.00	1460.00	0.00	32996.00	UPI	Posted			Admin	2026-10-24 09:37:40.431827+05:30	2026-10-24 09:37:40.431827+05:30	comp_mann
270	INV-2026-1256	SRU-02		Alembic Pharmaceuticals Limited		+91 98257 88990	alembicpharmaceuticalslimited@corp.in	Alembic Road, Vadodara	24AAACA3344H1Z4	2026-10-17	\N	Admin		1	1	2891.00	520.38	0.00	0.00	3411.38	Cash	Posted			Admin	2026-10-24 09:37:40.433691+05:30	2026-10-24 09:37:40.433691+05:30	comp_mann
271	INV-2026-1257	BRD-02		Amul Dairy Technical Facilities		+91 98259 00112	amuldairytechnicalfacilities@corp.in	Anand Main Dairy Campus, Anand	24AAACA7788J1Z6	2026-10-18	\N	Admin		1	3	64108.00	11539.44	3205.40	0.00	72442.04	Bank Transfer	Posted			Admin	2026-10-24 09:37:40.434888+05:30	2026-10-24 09:37:40.434888+05:30	comp_mann
272	INV-2026-1258	AMD-01		Adani Ports & Special Economic Zone		+91 98250 11223	adaniportsspecialeconomiczone@corp.in	Mundra Port SEZ, Kutch	24AAACA1234F1Z1	2026-10-19	\N	Admin		1	2	87452.00	15741.36	4372.60	0.00	98820.76	Cash	Posted			Admin	2026-10-24 09:37:40.437178+05:30	2026-10-24 09:37:40.437178+05:30	comp_mann
273	INV-2026-1259	AND-01		Amul Dairy Technical Facilities		+91 98259 00112	amuldairytechnicalfacilities@corp.in	Anand Main Dairy Campus, Anand	24AAACA7788J1Z6	2026-10-19	\N	Admin		1	1	14600.00	2628.00	0.00	0.00	17228.00	Card	Posted			Admin	2026-10-24 09:37:40.439456+05:30	2026-10-24 09:37:40.439456+05:30	comp_mann
274	INV-2026-1260	AND-01		Amul Dairy Technical Facilities		+91 98259 00112	amuldairytechnicalfacilities@corp.in	Anand Main Dairy Campus, Anand	24AAACA7788J1Z6	2026-10-20	\N	Admin		1	1	567000.00	102060.00	28350.00	0.00	640710.00	Cash	Posted			Admin	2026-10-24 09:37:40.440941+05:30	2026-10-24 09:37:40.440941+05:30	comp_mann
275	INV-2026-1261	SRU-02		Tata Motors Manufacturing Plant		+91 98254 55667	tatamotorsmanufacturingplant@corp.in	GIDC Industrial Estate, Sanand	24AAACT3456D1Z7	2026-10-20	\N	Admin		1	2	16498.00	2969.64	824.90	0.00	18642.74	Bank Transfer	Posted			Admin	2026-10-24 09:37:40.443114+05:30	2026-10-24 09:37:40.443114+05:30	comp_mann
276	INV-2026-1262	AMD-01		Shreeji Industrial Safety Systems		+91 98258 99001	shreejiindustrialsafetysystems@corp.in	GIDC Estate, Phase II, Halol	24AAACS5566I1Z0	2026-10-20	\N	Admin		1	1	5782.00	1040.76	0.00	0.00	6822.76	Card	Posted			Admin	2026-10-24 09:37:40.445073+05:30	2026-10-24 09:37:40.445073+05:30	comp_mann
277	INV-2026-1263	AMD-01		Amul Dairy Technical Facilities		+91 98259 00112	amuldairytechnicalfacilities@corp.in	Anand Main Dairy Campus, Anand	24AAACA7788J1Z6	2026-10-21	\N	Admin		1	3	15222.00	2739.96	761.10	0.00	17200.86	Card	Posted			Admin	2026-10-24 09:37:40.446559+05:30	2026-10-24 09:37:40.446559+05:30	comp_mann
278	INV-2026-1264	AMD-01		Zydus Lifesciences Biotech Park		+91 98255 66778	zyduslifesciencesbiotechpark@corp.in	Changodar, Ahmedabad	24AAACZ7890E1Z2	2026-10-21	\N	Admin		1	3	203449.00	36620.82	10172.45	0.00	229897.37	Card	Posted			Admin	2026-10-24 09:37:40.449119+05:30	2026-10-24 09:37:40.449119+05:30	comp_mann
279	INV-2026-1265	AMD-01		Adani Ports & Special Economic Zone		+91 98250 11223	adaniportsspecialeconomiczone@corp.in	Mundra Port SEZ, Kutch	24AAACA1234F1Z1	2026-10-22	\N	Admin		1	3	159180.00	28652.40	7959.00	0.00	179873.40	Card	Posted			Admin	2026-10-24 09:37:40.451053+05:30	2026-10-24 09:37:40.451053+05:30	comp_mann
280	INV-2026-1266	AMD-01		Torrent Pharmaceuticals Ltd		+91 98252 33445	torrentpharmaceuticalsltd@corp.in	Indrad, Kadi, Mehsana	24AAACT5678B1Z9	2026-10-23	\N	Admin		1	1	3835.00	690.30	0.00	0.00	4525.30	UPI	Posted			Admin	2026-10-24 09:37:40.4537+05:30	2026-10-24 09:37:40.4537+05:30	comp_mann
281	INV-2026-1267	AND-01		Reliance Industries Ltd (Hazira Complex)		+91 98251 22334	relianceindustriesltdhaziracomplex@corp.in	Hazira Industrial Area, Surat	24AAACR4321A1Z5	2026-10-23	\N	Admin		1	3	87308.20	15715.48	4365.41	0.00	98658.27	Bank Transfer	Posted			Admin	2026-10-24 09:37:40.455218+05:30	2026-10-24 09:37:40.455218+05:30	comp_mann
282	INV-2026-1268	BRD-02		Shreeji Industrial Safety Systems		+91 98258 99001	shreejiindustrialsafetysystems@corp.in	GIDC Estate, Phase II, Halol	24AAACS5566I1Z0	2026-10-23	\N	Admin		1	3	760176.00	136831.68	38008.80	0.00	858998.88	UPI	Posted			Admin	2026-10-24 09:37:40.457006+05:30	2026-10-24 09:37:40.457006+05:30	comp_mann
283	8	AMD-01	OC-924	CHETAN TRADING COMPANY.	Harshil SHah	918799061155	ndj@jn.com	G/4, NR BUS STAND, HALOL, Panchmahals, Gujarat, PIN: 389350	24AHXPS3105L1ZV	2026-10-24	2026-10-24	Admin	hdvhd	1	1	900.00	45.00	0.00	0.00	945.00	Cash	Posted		• Price: Ex-works Halol. Packing and forwarding extra at actuals.\n• GST: Extra as applicable (presently 18% or as defined per item).\n• Payment: 100% against delivery.\n• Delivery: Within 2 to 4 business days from PO receipt.	Admin	2026-10-24 22:55:05.151355+05:30	2026-10-24 22:55:05.151355+05:30	comp_mann
\.


--
-- TOC entry 5475 (class 0 OID 26154)
-- Dependencies: 252
-- Data for Name: loss_alerts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.loss_alerts (id, company_id, branch_code, title, description, severity, category, status, incident_time, created_at) FROM stdin;
1	comp_mann	SUR-02	Transfer Dispatch Mismatch (STR-0045)	Ahmedabad Hub dispatched 12 units of FE-ABC-4. Surat Outlet received only 11 units. Seal #4489 intact upon arrival.	danger	TRANSFER_MISMATCH	ACTIVE	2 hours ago	2026-10-24 17:40:31.382118+05:30
2	comp_mann	AMD-01	Receiving Shortage Claim Filed	PO-0128: National Fire delivered 98 items against 100 ordered. Vendor claim credit note CN-2025-012 generated.	warning	RECEIVING_SHORTAGE	ACTIVE	4 hours ago	2026-10-24 17:40:31.382118+05:30
3	comp_mann	BRD-02	After-Hours Stock Adjustment Flagged	Attempted manual write-off of 3 items at 22:45 PM by local staff. Blocked by system maker-checker rule.	info	AFTER_HOURS_ADJUSTMENT	ACTIVE	Yesterday	2026-10-24 17:40:31.382118+05:30
5	comp_mashtech	AND-01	Transit Package Seal Intact Verification	Inbound transfer inspected at receiving bay with zero seal breach	LOW	TRANSIT	RESOLVED	Yesterday, 04:30 PM	2026-10-25 10:32:01.722579+05:30
6	comp_mashtech	AND-01	Routine Shelf Cycle Count Variance	Routine inspection confirmed on-shelf stock matches ledger	LOW	COUNT_VARIANCE	ACTIVE	Today, 10:15 AM	2026-10-25 10:32:01.722579+05:30
7	comp_apexglobal_a1sf	ASH-01	Transit Package Seal Intact Verification	Inbound transfer inspected at receiving bay with zero seal breach	LOW	TRANSIT	RESOLVED	Yesterday, 04:30 PM	2026-10-25 10:32:01.737868+05:30
8	comp_apexglobal_a1sf	ASH-01	Routine Shelf Cycle Count Variance	Routine inspection confirmed on-shelf stock matches ledger	LOW	COUNT_VARIANCE	ACTIVE	Today, 10:15 AM	2026-10-25 10:32:01.737868+05:30
9	comp_zenithindu_vk4c	HCD-01	Transit Package Seal Intact Verification	Inbound transfer inspected at receiving bay with zero seal breach	LOW	TRANSIT	RESOLVED	Yesterday, 04:30 PM	2026-10-25 10:33:03.019837+05:30
10	comp_zenithindu_vk4c	HCD-01	Routine Shelf Cycle Count Variance	Routine inspection confirmed on-shelf stock matches ledger	LOW	COUNT_VARIANCE	ACTIVE	Today, 10:15 AM	2026-10-25 10:33:03.019837+05:30
11	comp_acmetechno_cajc	MUM-01	Transit Package Seal Intact Verification	Inbound transfer inspected at receiving bay with zero seal breach	LOW	TRANSIT	RESOLVED	Yesterday, 04:30 PM	2026-10-25 10:33:03.043926+05:30
12	comp_acmetechno_cajc	MUM-01	Routine Shelf Cycle Count Variance	Routine inspection confirmed on-shelf stock matches ledger	LOW	COUNT_VARIANCE	ACTIVE	Today, 10:15 AM	2026-10-25 10:33:03.043926+05:30
13	comp_mannengine_s000	MECB	Transit Package Seal Intact Verification	Inbound transfer inspected at receiving bay with zero seal breach	LOW	TRANSIT	RESOLVED	Yesterday, 04:30 PM	2026-10-25 10:33:03.066847+05:30
14	comp_mannengine_s000	MECB	Routine Shelf Cycle Count Variance	Routine inspection confirmed on-shelf stock matches ledger	LOW	COUNT_VARIANCE	ACTIVE	Today, 10:15 AM	2026-10-25 10:33:03.066847+05:30
4	comp_mann	AMD-01	Blind Cycle Count Variance Within Tolerance	Ahmedabad Hub PPE section blind count matched 99.4% with stock movements ledger.	success	CYCLE_COUNT_VARIANCE	RESOLVED	Yesterday	2026-10-24 17:40:31.382118+05:30
\.


--
-- TOC entry 5443 (class 0 OID 25495)
-- Dependencies: 220
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product (id, branch_code, supplier, name, description, weight, category, sub_category, pid, hsn, current_stock, min_stock, exp_months, sale_price, gst, purchase_price, total_without_tax, total_with_tax, exp_days, status, created_at, updated_at, company_id, barcode) FROM stdin;
15	COMMON	Honeywell Thermal Solutions	500°C Heat Resistant Aluminized Gloves	Kevlar backed aluminized radiant heat protection gloves 16 inch length	450 g	PPE	Industrial Safety	HT-GLV-500	6116	50.00	10.00	36.00	1848.00	12.00	1650.00	41250.00	46200.00	1080	OK	2026-10-22 19:52:57.790472+05:30	2026-10-24 11:02:52.560131+05:30	comp_mann	\N
22	COMMON	APC by Schneider Electric	3kVA Online UPS Pure Sine Wave 230V	Double-conversion online UPS with LCD interface and extended runtime battery pack	28 kg	Power Backup	Online UPS	UPS-3KVA-ON	8504	22.00	8.00	36.00	38200.00	18.00	32500.00	715000.00	843700.00	1080	OK	2026-10-22 21:07:32.70617+05:30	2026-10-22 21:07:32.70617+05:30	comp_mashtech	\N
4	COMMON	3M India Safety Division	Safety Goggles Clear Lens	Anti-fog polycarbonate impact resistant splash safety glasses	85 g	PPE	Eye Protection	SG-CL01	9004	67.00	30.00	36.00	171.10	18.00	145.00	9715.00	11463.70	1080	OK	2026-10-22 08:43:59.710307+05:30	2026-10-22 08:43:59.710307+05:30	comp_mann	\N
5	COMMON	MediSafe First Aid Co.	First Aid Kit Industrial	Comprehensive 50-item emergency workplace first aid box	1.8 kg	First Aid	Medical Kits	FA-KIT1	3006	28.00	10.00	24.00	952.00	12.00	850.00	23800.00	26656.00	720	OK	2026-10-22 08:43:59.711007+05:30	2026-10-22 08:43:59.711007+05:30	comp_mann	\N
6	COMMON	DuPont Protection Solutions	Fire Retardant Suit Type 5	Nomex III-A flame resistant boiler suit certified EN ISO 11612	1.4 kg	PPE	Body Protection	FR-SUT5	6211	8.00	5.00	48.00	5040.00	12.00	4500.00	36000.00	40320.00	1440	OK	2026-10-22 08:43:59.711586+05:30	2026-10-22 08:43:59.711586+05:30	comp_mann	\N
1	COMMON	FireTech Safety India Pvt Ltd	ABC Dry Powder Fire Ext. 4kg	Stored pressure dry chemical powder fire extinguisher 4kg capacity	6.5 kg	Fire Extinguishers	Powder Extinguisher	FE-ABC-4	8424	41.00	20.00	60.00	1321.60	18.00	1120.00	45920.00	54185.60	1800	OK	2026-10-22 08:43:59.704639+05:30	2026-10-22 14:42:20.579553+05:30	comp_mann	\N
8	COMMON	Hazchem Safety Equipments Surat	Chemical Foam Fire Ext. 50L Trolley	Heavy duty AFFF foam wheeled mobile extinguisher for petrochemical plants	85 kg	Fire Equipment	Fire Extinguisher	CF-EXT-50	8424	14.00	5.00	60.00	9912.00	18.00	8400.00	117600.00	138768.00	1800	OK	2026-10-22 19:52:57.778291+05:30	2026-10-22 19:52:57.778291+05:30	comp_mann	\N
9	COMMON	Textile Fire Shield Ltd Surat	Heavy Duty Fire Blanket 2x2m Fiberglass	Woven fiberglass fabric heat resistant emergency smothering blanket	1.8 kg	Fire Equipment	Industrial Safety	FB-HVY-2	7019	35.00	15.00	48.00	1475.00	18.00	1250.00	43750.00	51625.00	1440	OK	2026-10-22 19:52:57.783759+05:30	2026-10-22 19:52:57.783759+05:30	comp_mann	\N
10	COMMON	Dräger Safety India	Full Face Chemical Gas Mask FFP3	Panoramic polycarbonate mask with dual ABEK1P3 organic vapor canisters	620 g	PPE	Mask	GM-FFP3	9020	22.00	10.00	36.00	3363.00	18.00	2850.00	62700.00	73986.00	1080	OK	2026-10-22 19:52:57.78468+05:30	2026-10-22 19:52:57.78468+05:30	comp_mann	\N
11	COMMON	Tiger Safety Footwear	Chemical Resistant Steel Toe Shoes S3	Acid, alkali & oil resistant nitrile sole with 200J impact steel toe cap	1.2 kg	PPE	Safety Shoes	CS-BOOT-9	6403	18.00	8.00	24.00	2072.00	12.00	1850.00	33300.00	37296.00	720	OK	2026-10-22 19:52:57.785628+05:30	2026-10-22 19:52:57.785628+05:30	comp_mann	\N
12	COMMON	DuPont Personal Protection	Tychem 6000 Hazmat Liquid Suit	Gas-tight chemical protection coverall certified EN 14605 Type 3-B	900 g	PPE	Industrial Safety	HAZ-TYP3	6210	4.00	10.00	60.00	7168.00	12.00	6400.00	25600.00	28672.00	1800	Low	2026-10-22 19:52:57.786688+05:30	2026-10-22 19:52:57.786688+05:30	comp_mann	\N
7	COMMON	Honeywell Building Technologies	Smoke Detector Photoelectric	Optical photoelectric ceiling sensor with built-in 85dB siren	220 g	Detection	Fire Alarms	SM-DET1	8531	0.00	10.00	60.00	1416.00	18.00	1200.00	0.00	0.00	1800	Out	2026-10-22 08:43:59.712295+05:30	2026-10-23 14:45:36.984083+05:30	comp_mann	\N
2	COMMON	SafeZone Equipments Ltd	CO2 Fire Extinguisher 2kg	Seamless carbon dioxide gas extinguisher with wheel horn	5.2 kg	Fire Extinguishers	Gas Extinguisher	FE-CO2-2	8424	11.00	15.00	60.00	2891.00	18.00	2450.00	26950.00	31801.00	1800	Low	2026-10-22 08:43:59.708464+05:30	2026-10-23 15:48:52.160387+05:30	comp_mann	\N
23	COMMON	Desco ESD Electronics Safety	Anti-Static ESD Grounding Mat 2x1m	Dual layer static dissipative rubber table mat with grounding cord & wrist strap	3.2 kg	Electronic Safety	ESD Protection	ESD-MAT-01	3926	45.00	15.00	60.00	2450.00	18.00	2000.00	90000.00	106200.00	1800	OK	2026-10-22 21:07:32.707211+05:30	2026-10-22 21:07:32.707211+05:30	comp_mashtech	\N
24	COMMON	D-Link Networking Systems	10Gbps Shielded Cat6A Cable Roll 100m	SFTP 23 AWG solid copper 500MHz high speed network cable reel	6.8 kg	Networking	Cables & Patching	CAT6A-100M	8544	6.00	10.00	120.00	4950.00	18.00	4200.00	25200.00	29736.00	3600	Low	2026-10-22 21:07:32.7081+05:30	2026-10-22 21:07:32.7081+05:30	comp_mashtech	\N
26	COMMON	Cisco Systems Optical Division	10G SFP+ Optical Transceiver Module 10km	1310nm Single-Mode Fiber LC connector transceiver hot-swappable	35 g	Networking	Fiber Optics	FBR-SFP-10	8517	55.00	20.00	60.00	3650.00	18.00	3100.00	170500.00	201190.00	1800	OK	2026-10-22 21:07:32.711066+05:30	2026-10-22 21:07:32.711066+05:30	comp_mashtech	\N
28	COMMON	Raritan Power Distribution	Smart Metered Rack PDU 16A 230V 24 Outlets	0U vertical rack power distribution unit with Ethernet remote power monitoring	4.8 kg	Power Backup	PDU Hardware	RACK-PDU-16	8537	9.00	5.00	60.00	18500.00	18.00	15600.00	140400.00	165672.00	1800	OK	2026-10-22 21:07:32.715635+05:30	2026-10-22 21:07:32.715635+05:30	comp_mashtech	\N
13	COMMON	Tyco Fire Protection Products	Pendant Sprinkler Head 68°C Red Bulb	Brass standard response fire sprinkler orifice 1/2 inch NPT thread	120 g	Fire Equipment	Industrial Safety	SP-HDR-68	8424	170.00	30.00	120.00	767.00	18.00	650.00	55250.00	65195.00	3600	OK	2026-10-22 19:52:57.788184+05:30	2026-10-24 11:02:52.560131+05:30	comp_mann	\N
16	COMMON	Schneider Electric Safety	Emergency LED Exit Light 3h Backup	Ceiling/wall mounted green luminaire with Ni-Cd self-contained battery pack	1.1 kg	PPE	Industrial Safety	EX-LED-BAT	9405	80.00	15.00	60.00	1298.00	18.00	1100.00	44000.00	51920.00	1800	OK	2026-10-22 19:52:57.791259+05:30	2026-10-24 11:02:52.560131+05:30	comp_mann	\N
25	COMMON	Fortinet Enterprise Security	10Gbps Enterprise Next-Gen Firewall Gateway	Multi-threat security appliance with hardware accelerated SSL inspection & IPS	7.5 kg	Network Security	Firewall Hardware	FW-GW-10G	8517	12.00	4.00	60.00	94500.00	18.00	81000.00	972000.00	1146960.00	1800	OK	2026-10-22 21:07:32.709963+05:30	2026-10-22 21:07:32.709963+05:30	comp_mashtech	\N
27	COMMON	Thorlabs Laser Safety Products	Optical Fiber Laser Safety Protective Goggles	Polycarbonate laser alignment eyewear certified OD7+ @ 800-1100nm	90 g	Optical Safety	Laser PPE	LSR-SFT-GLS	9004	18.00	8.00	48.00	5800.00	18.00	4900.00	88200.00	104076.00	1440	OK	2026-10-22 21:07:32.71233+05:30	2026-10-22 21:07:32.71233+05:30	comp_mashtech	\N
14	COMMON	Newage Fire Fighting Co	Swinging Hose Reel Drum 30m with Nozzle	Wall mounted manual swing type fire hose reel with 19mm braided rubber hose	24 kg	Fire Equipment	Industrial Safety	HR-SWV-30	8424	16.00	12.00	60.00	7316.00	18.00	6200.00	49600.00	58528.00	1800	Low	2026-10-22 19:52:57.789289+05:30	2026-10-24 11:02:52.560131+05:30	comp_mann	\N
21	COMMON	Schneider IT Infrastructure India	42U Server Rack Closed Smart Cooling	Perforated front/rear doors with digital temperature monitoring & roof fan unit	115 kg	Server Infrastructure	Racks & Enclosures	SRV-RCK-42	8537	14.00	5.00	60.00	48500.00	18.00	41000.00	574000.00	677320.00	1800	OK	2026-10-22 21:07:32.704909+05:30	2026-10-22 21:07:32.704909+05:30	comp_mashtech	\N
3	COMMON	Karam Safety Products	Safety Helmet M-201 ISI	High-density polyethylene safety helmet with 4-point ratchet harness	380 g	PPE	Head Protection	SH-M201	6506	0.00	25.00	36.00	336.30	18.00	285.00	0.00	0.00	1080	Out	2026-10-22 08:43:59.70956+05:30	2026-10-23 14:45:36.984083+05:30	comp_mann	\N
341	AMD-01	Standard Enterprise Supplier	Commercial Starter Pack Item A	Initial inventory item generated during business setup	1 kg	Standard Supplies	Commercial Supplies	PRD-START-01	8424	45.00	10.00	12.00	1500.00	18.00	950.00	0.00	0.00	360	OK	2026-10-25 08:57:03.809317+05:30	2026-10-25 08:57:03.809317+05:30	comp_apexglobal_a1sf	\N
342	AMD-01	Standard Enterprise Supplier	Enterprise Inventory Item B	Initial inventory item generated during business setup	1 kg	Equipment	Commercial Supplies	PRD-START-02	8424	25.00	10.00	12.00	3200.00	18.00	2100.00	0.00	0.00	360	OK	2026-10-25 08:57:03.809317+05:30	2026-10-25 08:57:03.809317+05:30	comp_apexglobal_a1sf	\N
343	AMD-01	Standard Enterprise Supplier	Universal Consumable Item C	Initial inventory item generated during business setup	1 kg	Consumables	Commercial Supplies	PRD-START-03	8424	80.00	10.00	12.00	450.00	18.00	280.00	0.00	0.00	360	OK	2026-10-25 08:57:03.809317+05:30	2026-10-25 08:57:03.809317+05:30	comp_apexglobal_a1sf	\N
361	AMD-01	Standard Enterprise Supplier	Commercial Starter Pack Item A	Initial inventory item generated during business setup	1 kg	Standard Supplies	Commercial Supplies	PRD-START-01	8424	45.00	10.00	12.00	1500.00	18.00	950.00	0.00	0.00	360	OK	2026-10-25 09:02:14.545842+05:30	2026-10-25 09:02:14.545842+05:30	comp_zenithindu_vk4c	\N
362	AMD-01	Standard Enterprise Supplier	Enterprise Inventory Item B	Initial inventory item generated during business setup	1 kg	Equipment	Commercial Supplies	PRD-START-02	8424	25.00	10.00	12.00	3200.00	18.00	2100.00	0.00	0.00	360	OK	2026-10-25 09:02:14.545842+05:30	2026-10-25 09:02:14.545842+05:30	comp_zenithindu_vk4c	\N
363	AMD-01	Standard Enterprise Supplier	Universal Consumable Item C	Initial inventory item generated during business setup	1 kg	Consumables	Commercial Supplies	PRD-START-03	8424	80.00	10.00	12.00	450.00	18.00	280.00	0.00	0.00	360	OK	2026-10-25 09:02:14.545842+05:30	2026-10-25 09:02:14.545842+05:30	comp_zenithindu_vk4c	\N
364	AMD-01	Standard Enterprise Supplier	Commercial Starter Pack Item A	Initial inventory item generated during business setup	1 kg	Standard Supplies	Commercial Supplies	PRD-START-01	8424	45.00	10.00	12.00	1500.00	18.00	950.00	0.00	0.00	360	OK	2026-10-25 09:05:50.198483+05:30	2026-10-25 09:05:50.198483+05:30	comp_acmetechno_cajc	\N
365	AMD-01	Standard Enterprise Supplier	Enterprise Inventory Item B	Initial inventory item generated during business setup	1 kg	Equipment	Commercial Supplies	PRD-START-02	8424	25.00	10.00	12.00	3200.00	18.00	2100.00	0.00	0.00	360	OK	2026-10-25 09:05:50.198483+05:30	2026-10-25 09:05:50.198483+05:30	comp_acmetechno_cajc	\N
366	AMD-01	Standard Enterprise Supplier	Universal Consumable Item C	Initial inventory item generated during business setup	1 kg	Consumables	Commercial Supplies	PRD-START-03	8424	80.00	10.00	12.00	450.00	18.00	280.00	0.00	0.00	360	OK	2026-10-25 09:05:50.198483+05:30	2026-10-25 09:05:50.198483+05:30	comp_acmetechno_cajc	\N
384	AMD-01	Standard Enterprise Supplier	Commercial Starter Pack Item A	Initial inventory item generated during business setup	1 kg	Standard Supplies	Commercial Supplies	PRD-START-01	8424	45.00	10.00	12.00	1500.00	18.00	950.00	0.00	0.00	360	OK	2026-10-25 09:25:03.672677+05:30	2026-10-25 09:25:03.672677+05:30	comp_mannengine_s000	\N
385	AMD-01	Standard Enterprise Supplier	Enterprise Inventory Item B	Initial inventory item generated during business setup	1 kg	Equipment	Commercial Supplies	PRD-START-02	8424	25.00	10.00	12.00	3200.00	18.00	2100.00	0.00	0.00	360	OK	2026-10-25 09:25:03.672677+05:30	2026-10-25 09:25:03.672677+05:30	comp_mannengine_s000	\N
386	AMD-01	Standard Enterprise Supplier	Universal Consumable Item C	Initial inventory item generated during business setup	1 kg	Consumables	Commercial Supplies	PRD-START-03	8424	80.00	10.00	12.00	450.00	18.00	280.00	0.00	0.00	360	OK	2026-10-25 09:25:03.672677+05:30	2026-10-25 09:25:03.672677+05:30	comp_mannengine_s000	\N
710	COMMON	Test Supplier	Test Common Fire Valve		2000 g	Hardware	Valves & Hydrants	TEST-COMMON-1793386841859	8424	25.00	5.00	12.00	590.00	18.00	500.00	12500.00	14750.00	360	OK	2026-10-31 00:30:41.928177+05:30	2026-10-31 00:30:41.928177+05:30	comp_mann	TEST-COMMON-1793386841859
\.


--
-- TOC entry 5457 (class 0 OID 25837)
-- Dependencies: 234
-- Data for Name: purchase_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.purchase_items (id, purchase_id, po_no, item_code, item_name, unit, hsn_code, qty, unit_price, discount, effective_price, tax_rate, tax_amount, subtotal, remark, created_at) FROM stdin;
1	1	1	FE-ABC-4	ABC Dry Powder Fire Ext. 4kg	NOS	8424	100.00	1120.00	0.00	1120.00	18.00	20160.00	112000.00	Main warehouse	2026-10-23 18:43:29.338662+05:30
2	1	1	SH-M201	Safety Helmet M-201 ISI	NOS	6506	50.00	227.80	0.00	227.80	18.00	2050.20	11390.00	Yellow Industrial	2026-10-23 18:43:29.342336+05:30
3	2	2	FE-CO2-2	CO2 Fire Extinguisher 2kg	NOS	8424	25.00	2298.30	0.00	2298.30	18.00	10342.35	57457.50	Wheel horn assembly	2026-10-23 18:43:29.344608+05:30
4	3	3	SH-M201	Safety Helmet M-201 ISI	NOS	6506	100.00	198.31	0.00	198.31	18.00	3569.58	19831.00	Standard packing	2026-10-23 18:43:29.34657+05:30
5	4	1	CUSTOM	Industrial Ball Bearing	NOS		1.00	1000.00	0.00	1000.00	18.00	180.00	1000.00		2026-10-23 18:56:17.955846+05:30
6	5	4	FE-ABC-4	ABC Dry Powder Fire Ext. 4kg	NOS	8424	1.00	1120.00	0.00	1120.00	18.00	201.60	1120.00		2026-10-23 21:08:54.061204+05:30
7	59	5	FE-ABC-4	ABC Dry Powder Fire Ext. 4kg	NOS	8424	1.00	1120.00	0.00	1120.00	18.00	201.60	1120.00		2026-10-25 16:54:39.533797+05:30
9	60	6	FE-ABC-4	ABC Dry Powder Fire Ext. 4kg	NOS	8424	1.00	1120.00	0.00	1120.00	18.00	201.60	1120.00		2026-10-26 15:44:48.45763+05:30
10	60	6	CF-EXT-50	Chemical Foam Fire Ext. 50L Trolley	NOS	8424	1.00	8400.00	0.00	8400.00	18.00	1512.00	8400.00		2026-10-26 15:44:48.45763+05:30
\.


--
-- TOC entry 5455 (class 0 OID 25795)
-- Dependencies: 232
-- Data for Name: purchases; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.purchases (id, po_no, company_id, branch_code, supplier_uid, supplier_name, contact_person, supplier_phone, supplier_email, supplier_address, supplier_gstin, po_date, due_date, delivery_date, reference_no, revision_no, total_items, subtotal, total_tax, discount_amount, round_off, grand_total, payment_terms, status, grn_no, po_remark, terms_conditions, created_by, created_at, updated_at) FROM stdin;
1	1	comp_mann	AMD-01	SUP-001	National Fire Equip Pvt Ltd	Suresh Mehta	9825123456	sales@nationalfire.in	Plot 12, GIDC Halol Industrial Area, Panchmahal, Gujarat	24AABCN1234E1Z1	2026-10-18	2026-11-17	2026-10-25	REQ-PO-0128	1	2	123389.83	22210.17	0.00	0.00	145600.00	Credit 30 Days	GRN Done	GRN-0981	Bulk stock replenishment for Q4.	• Delivery within 3 business days.\n• Packing and freight included.\n• 100% replacement warranty on transit defects.	Admin	2026-10-23 18:43:29.336596+05:30	2026-10-23 18:43:29.336596+05:30
2	2	comp_mann	AMD-01	SUP-002	SafeGuard Industries	Kiran Parmar	9879123456	orders@safeguard.com	Sector 4, Gandhinagar Industrial Zone, Gujarat	24AAECS9876G1Z3	2026-10-15	2026-10-30	2026-10-22	REQ-PO-0127	1	1	57457.63	10342.37	0.00	0.00	67800.00	15 Days	Ordered		CO2 cylinders safety stock order.	• Direct site delivery with test certificates.\n• GST extra as applicable.	Admin	2026-10-23 18:43:29.343555+05:30	2026-10-23 18:43:29.343555+05:30
3	3	comp_mann	AMD-01	SUP-003	Hindustan Safety Works	Ramesh Vaghela	9824987654	info@hindustansafety.com	Phase 1, Naroda GIDC, Ahmedabad, Gujarat	24AAACH5432K1Z9	2026-10-14	2026-11-07	2026-10-23	REQ-PO-0126	1	1	19830.51	3569.49	0.00	0.00	23400.00	Immediate / Cash	Ordered		Counter stock immediate procurement.	• Standard manufacturing warranty applicable.	Admin	2026-10-23 18:43:29.345537+05:30	2026-10-23 18:43:29.345537+05:30
4	1	comp_mashtech	AND-01		Reliance Jamnagar						2026-10-23	2026-11-22	2026-10-30		1	1	1000.00	180.00	0.00	0.00	1180.00	Credit 30 Days	Ordered			• Delivery: Within agreed timeline directly to specified branch warehouse.\n• Packing & Freight: Included in price unless specifically agreed otherwise.\n• Inspection: Subject to quality verification upon delivery; defective items to be replaced within 48h.\n• Payment: As per agreed credit terms against original tax invoice & verified GRN.	Admin	2026-10-23 18:56:17.955846+05:30	2026-10-23 18:56:17.955846+05:30
5	4	comp_mann	AMD-01	SUP-002	SafeGuard Industries	SafeGuard Industries	9879123456	orders@safeguard.com	Sector 4, Gandhinagar Industrial Zone, Gujarat	24AAECS9876G1Z3	2026-10-23	2026-11-22	2026-10-30		1	1	1120.00	201.60	0.00	0.00	1321.60	Credit 30 Days	Ordered			• Delivery: Within agreed timeline directly to specified branch warehouse.\n• Packing & Freight: Included in price unless specifically agreed otherwise.\n• Inspection: Subject to quality verification upon delivery; defective items to be replaced within 48h.\n• Payment: As per agreed credit terms against original tax invoice & verified GRN.	Admin	2026-10-23 21:08:54.061204+05:30	2026-10-23 21:08:54.061204+05:30
6	PO-2026-1001	comp_mann	BRD-02		National Safety Equipment Manufacturing Ltd						2026-05-04	\N	\N		1	2	49459.00	8902.62	0.00	0.00	58361.62	Credit 30 Days	Received				Admin	2026-10-24 09:37:39.703297+05:30	2026-10-24 09:37:39.703297+05:30
7	PO-2026-1002	comp_mashtech	SRU-02		National Safety Equipment Manufacturing Ltd						2026-05-08	\N	\N		1	2	23441.00	4219.38	0.00	0.00	27660.38	Credit 30 Days	Received				Admin	2026-10-24 09:37:39.724783+05:30	2026-10-24 09:37:39.724783+05:30
8	PO-2026-1003	comp_mann	AMD-01		National Safety Equipment Manufacturing Ltd						2026-05-13	\N	\N		1	2	26494.00	4768.92	0.00	0.00	31262.92	Credit 30 Days	Received				Admin	2026-10-24 09:37:39.741102+05:30	2026-10-24 09:37:39.741102+05:30
9	PO-2026-1004	comp_mann	BRD-02		National Safety Equipment Manufacturing Ltd						2026-05-15	\N	\N		1	2	20393.00	3670.74	0.00	0.00	24063.74	Credit 30 Days	Received				Admin	2026-10-24 09:37:39.76188+05:30	2026-10-24 09:37:39.76188+05:30
10	PO-2026-1005	comp_mann	AMD-01		National Safety Equipment Manufacturing Ltd						2026-05-19	\N	\N		1	2	16524.00	2974.32	0.00	0.00	19498.32	Credit 30 Days	Received				Admin	2026-10-24 09:37:39.780624+05:30	2026-10-24 09:37:39.780624+05:30
11	PO-2026-1006	comp_mann	AMD-01		National Safety Equipment Manufacturing Ltd						2026-05-21	\N	\N		1	2	43551.00	7839.18	0.00	0.00	51390.18	Credit 30 Days	Received				Admin	2026-10-24 09:37:39.798458+05:30	2026-10-24 09:37:39.798458+05:30
12	PO-2026-1007	comp_mann	BRD-02		National Safety Equipment Manufacturing Ltd						2026-05-26	\N	\N		1	2	19851.00	3573.18	0.00	0.00	23424.18	Credit 30 Days	Received				Admin	2026-10-24 09:37:39.816628+05:30	2026-10-24 09:37:39.816628+05:30
13	PO-2026-1008	comp_mashtech	AND-01		National Safety Equipment Manufacturing Ltd						2026-05-27	\N	\N		1	2	18151.00	3267.18	0.00	0.00	21418.18	Credit 30 Days	Received				Admin	2026-10-24 09:37:39.83193+05:30	2026-10-24 09:37:39.83193+05:30
14	PO-2026-1009	comp_mann	AMD-01		National Safety Equipment Manufacturing Ltd						2026-06-01	\N	\N		1	2	39926.00	7186.68	0.00	0.00	47112.68	Credit 30 Days	Received				Admin	2026-10-24 09:37:39.850947+05:30	2026-10-24 09:37:39.850947+05:30
15	PO-2026-1010	comp_mashtech	AND-01		National Safety Equipment Manufacturing Ltd						2026-06-03	\N	\N		1	2	24465.00	4403.70	0.00	0.00	28868.70	Credit 30 Days	Received				Admin	2026-10-24 09:37:39.874206+05:30	2026-10-24 09:37:39.874206+05:30
16	PO-2026-1011	comp_mann	BRD-02		National Safety Equipment Manufacturing Ltd						2026-06-05	\N	\N		1	2	30667.00	5520.06	0.00	0.00	36187.06	Credit 30 Days	Received				Admin	2026-10-24 09:37:39.891144+05:30	2026-10-24 09:37:39.891144+05:30
17	PO-2026-1012	comp_mann	AMD-01		National Safety Equipment Manufacturing Ltd						2026-06-08	\N	\N		1	2	40536.00	7296.48	0.00	0.00	47832.48	Credit 30 Days	Received				Admin	2026-10-24 09:37:39.900614+05:30	2026-10-24 09:37:39.900614+05:30
18	PO-2026-1013	comp_mann	BRD-02		National Safety Equipment Manufacturing Ltd						2026-06-10	\N	\N		1	2	39750.00	7155.00	0.00	0.00	46905.00	Credit 30 Days	Received				Admin	2026-10-24 09:37:39.91102+05:30	2026-10-24 09:37:39.91102+05:30
19	PO-2026-1014	comp_mann	AMD-01		National Safety Equipment Manufacturing Ltd						2026-06-13	\N	\N		1	2	45336.00	8160.48	0.00	0.00	53496.48	Credit 30 Days	Received				Admin	2026-10-24 09:37:39.926119+05:30	2026-10-24 09:37:39.926119+05:30
20	PO-2026-1015	comp_mann	AMD-01		National Safety Equipment Manufacturing Ltd						2026-06-17	\N	\N		1	2	20051.00	3609.18	0.00	0.00	23660.18	Credit 30 Days	Received				Admin	2026-10-24 09:37:39.947104+05:30	2026-10-24 09:37:39.947104+05:30
21	PO-2026-1016	comp_mann	BRD-02		National Safety Equipment Manufacturing Ltd						2026-06-21	\N	\N		1	2	26305.00	4734.90	0.00	0.00	31039.90	Credit 30 Days	Received				Admin	2026-10-24 09:37:39.962613+05:30	2026-10-24 09:37:39.962613+05:30
22	PO-2026-1017	comp_mann	BRD-02		National Safety Equipment Manufacturing Ltd						2026-06-23	\N	\N		1	2	45304.00	8154.72	0.00	0.00	53458.72	Credit 30 Days	Received				Admin	2026-10-24 09:37:39.976184+05:30	2026-10-24 09:37:39.976184+05:30
23	PO-2026-1018	comp_mashtech	AND-01		National Safety Equipment Manufacturing Ltd						2026-06-26	\N	\N		1	2	38089.00	6856.02	0.00	0.00	44945.02	Credit 30 Days	Received				Admin	2026-10-24 09:37:39.989847+05:30	2026-10-24 09:37:39.989847+05:30
24	PO-2026-1019	comp_mashtech	SRU-02		National Safety Equipment Manufacturing Ltd						2026-06-29	\N	\N		1	2	27545.00	4958.10	0.00	0.00	32503.10	Credit 30 Days	Received				Admin	2026-10-24 09:37:40.004758+05:30	2026-10-24 09:37:40.004758+05:30
25	PO-2026-1020	comp_mashtech	AND-01		National Safety Equipment Manufacturing Ltd						2026-07-01	\N	\N		1	2	33162.00	5969.16	0.00	0.00	39131.16	Credit 30 Days	Received				Admin	2026-10-24 09:37:40.01869+05:30	2026-10-24 09:37:40.01869+05:30
26	PO-2026-1021	comp_mashtech	AND-01		National Safety Equipment Manufacturing Ltd						2026-07-04	\N	\N		1	2	32565.00	5861.70	0.00	0.00	38426.70	Credit 30 Days	Received				Admin	2026-10-24 09:37:40.032892+05:30	2026-10-24 09:37:40.032892+05:30
27	PO-2026-1022	comp_mann	AMD-01		National Safety Equipment Manufacturing Ltd						2026-07-07	\N	\N		1	2	28597.00	5147.46	0.00	0.00	33744.46	Credit 30 Days	Received				Admin	2026-10-24 09:37:40.046235+05:30	2026-10-24 09:37:40.046235+05:30
28	PO-2026-1023	comp_mann	AMD-01		National Safety Equipment Manufacturing Ltd						2026-07-13	\N	\N		1	2	38595.00	6947.10	0.00	0.00	45542.10	Credit 30 Days	Received				Admin	2026-10-24 09:37:40.063349+05:30	2026-10-24 09:37:40.063349+05:30
29	PO-2026-1024	comp_mann	BRD-02		National Safety Equipment Manufacturing Ltd						2026-07-15	\N	\N		1	2	35923.00	6466.14	0.00	0.00	42389.14	Credit 30 Days	Received				Admin	2026-10-24 09:37:40.076364+05:30	2026-10-24 09:37:40.076364+05:30
30	PO-2026-1025	comp_mann	BRD-02		National Safety Equipment Manufacturing Ltd						2026-07-17	\N	\N		1	2	47267.00	8508.06	0.00	0.00	55775.06	Credit 30 Days	Received				Admin	2026-10-24 09:37:40.089497+05:30	2026-10-24 09:37:40.089497+05:30
31	PO-2026-1026	comp_mann	AMD-01		National Safety Equipment Manufacturing Ltd						2026-07-22	\N	\N		1	2	41281.00	7430.58	0.00	0.00	48711.58	Credit 30 Days	Received				Admin	2026-10-24 09:37:40.102089+05:30	2026-10-24 09:37:40.102089+05:30
32	PO-2026-1027	comp_mann	BRD-02		National Safety Equipment Manufacturing Ltd						2026-07-23	\N	\N		1	2	40980.00	7376.40	0.00	0.00	48356.40	Credit 30 Days	Received				Admin	2026-10-24 09:37:40.119562+05:30	2026-10-24 09:37:40.119562+05:30
33	PO-2026-1028	comp_mashtech	SRU-02		National Safety Equipment Manufacturing Ltd						2026-07-27	\N	\N		1	2	15321.00	2757.78	0.00	0.00	18078.78	Credit 30 Days	Received				Admin	2026-10-24 09:37:40.136703+05:30	2026-10-24 09:37:40.136703+05:30
34	PO-2026-1029	comp_mann	AMD-01		National Safety Equipment Manufacturing Ltd						2026-07-29	\N	\N		1	2	19111.00	3439.98	0.00	0.00	22550.98	Credit 30 Days	Received				Admin	2026-10-24 09:37:40.147144+05:30	2026-10-24 09:37:40.147144+05:30
35	PO-2026-1030	comp_mann	AMD-01		National Safety Equipment Manufacturing Ltd						2026-07-31	\N	\N		1	2	28692.00	5164.56	0.00	0.00	33856.56	Credit 30 Days	Received				Admin	2026-10-24 09:37:40.156908+05:30	2026-10-24 09:37:40.156908+05:30
36	PO-2026-1031	comp_mashtech	SRU-02		National Safety Equipment Manufacturing Ltd						2026-08-04	\N	\N		1	2	46402.00	8352.36	0.00	0.00	54754.36	Credit 30 Days	Received				Admin	2026-10-24 09:37:40.166765+05:30	2026-10-24 09:37:40.166765+05:30
37	PO-2026-1032	comp_mann	AMD-01		National Safety Equipment Manufacturing Ltd						2026-08-09	\N	\N		1	2	46994.00	8458.92	0.00	0.00	55452.92	Credit 30 Days	Received				Admin	2026-10-24 09:37:40.177317+05:30	2026-10-24 09:37:40.177317+05:30
38	PO-2026-1033	comp_mann	BRD-02		National Safety Equipment Manufacturing Ltd						2026-08-11	\N	\N		1	2	45287.00	8151.66	0.00	0.00	53438.66	Credit 30 Days	Received				Admin	2026-10-24 09:37:40.186729+05:30	2026-10-24 09:37:40.186729+05:30
39	PO-2026-1034	comp_mann	BRD-02		National Safety Equipment Manufacturing Ltd						2026-08-15	\N	\N		1	2	42595.00	7667.10	0.00	0.00	50262.10	Credit 30 Days	Received				Admin	2026-10-24 09:37:40.195387+05:30	2026-10-24 09:37:40.195387+05:30
40	PO-2026-1035	comp_mann	BRD-02		National Safety Equipment Manufacturing Ltd						2026-08-19	\N	\N		1	2	46329.00	8339.22	0.00	0.00	54668.22	Credit 30 Days	Received				Admin	2026-10-24 09:37:40.206545+05:30	2026-10-24 09:37:40.206545+05:30
41	PO-2026-1036	comp_mann	AMD-01		National Safety Equipment Manufacturing Ltd						2026-08-21	\N	\N		1	2	45524.00	8194.32	0.00	0.00	53718.32	Credit 30 Days	Received				Admin	2026-10-24 09:37:40.220356+05:30	2026-10-24 09:37:40.220356+05:30
42	PO-2026-1037	comp_mann	AMD-01		National Safety Equipment Manufacturing Ltd						2026-08-26	\N	\N		1	2	28693.00	5164.74	0.00	0.00	33857.74	Credit 30 Days	Received				Admin	2026-10-24 09:37:40.236167+05:30	2026-10-24 09:37:40.236167+05:30
43	PO-2026-1038	comp_mann	AMD-01		National Safety Equipment Manufacturing Ltd						2026-08-31	\N	\N		1	2	23291.00	4192.38	0.00	0.00	27483.38	Credit 30 Days	Received				Admin	2026-10-24 09:37:40.253112+05:30	2026-10-24 09:37:40.253112+05:30
44	PO-2026-1039	comp_mashtech	SRU-02		National Safety Equipment Manufacturing Ltd						2026-09-03	\N	\N		1	2	37824.00	6808.32	0.00	0.00	44632.32	Credit 30 Days	Received				Admin	2026-10-24 09:37:40.274115+05:30	2026-10-24 09:37:40.274115+05:30
45	PO-2026-1040	comp_mann	AMD-01		National Safety Equipment Manufacturing Ltd						2026-09-08	\N	\N		1	2	15369.00	2766.42	0.00	0.00	18135.42	Credit 30 Days	Received				Admin	2026-10-24 09:37:40.290329+05:30	2026-10-24 09:37:40.290329+05:30
46	PO-2026-1041	comp_mann	BRD-02		National Safety Equipment Manufacturing Ltd						2026-09-12	\N	\N		1	2	28720.00	5169.60	0.00	0.00	33889.60	Credit 30 Days	Received				Admin	2026-10-24 09:37:40.303859+05:30	2026-10-24 09:37:40.303859+05:30
47	PO-2026-1042	comp_mann	AMD-01		National Safety Equipment Manufacturing Ltd						2026-09-15	\N	\N		1	2	38966.00	7013.88	0.00	0.00	45979.88	Credit 30 Days	Received				Admin	2026-10-24 09:37:40.316021+05:30	2026-10-24 09:37:40.316021+05:30
48	PO-2026-1043	comp_mashtech	SRU-02		National Safety Equipment Manufacturing Ltd						2026-09-18	\N	\N		1	2	35899.00	6461.82	0.00	0.00	42360.82	Credit 30 Days	Received				Admin	2026-10-24 09:37:40.332028+05:30	2026-10-24 09:37:40.332028+05:30
49	PO-2026-1044	comp_mashtech	AND-01		National Safety Equipment Manufacturing Ltd						2026-09-22	\N	\N		1	2	20073.00	3613.14	0.00	0.00	23686.14	Credit 30 Days	Received				Admin	2026-10-24 09:37:40.345869+05:30	2026-10-24 09:37:40.345869+05:30
50	PO-2026-1045	comp_mann	BRD-02		National Safety Equipment Manufacturing Ltd						2026-09-24	\N	\N		1	2	21851.00	3933.18	0.00	0.00	25784.18	Credit 30 Days	Received				Admin	2026-10-24 09:37:40.362003+05:30	2026-10-24 09:37:40.362003+05:30
51	PO-2026-1046	comp_mashtech	SRU-02		National Safety Equipment Manufacturing Ltd						2026-09-29	\N	\N		1	2	47621.00	8571.78	0.00	0.00	56192.78	Credit 30 Days	Received				Admin	2026-10-24 09:37:40.378095+05:30	2026-10-24 09:37:40.378095+05:30
52	PO-2026-1047	comp_mashtech	SRU-02		National Safety Equipment Manufacturing Ltd						2026-10-02	\N	\N		1	2	46219.00	8319.42	0.00	0.00	54538.42	Credit 30 Days	Received				Admin	2026-10-24 09:37:40.390081+05:30	2026-10-24 09:37:40.390081+05:30
53	PO-2026-1048	comp_mann	BRD-02		National Safety Equipment Manufacturing Ltd						2026-10-08	\N	\N		1	2	30581.00	5504.58	0.00	0.00	36085.58	Credit 30 Days	Received				Admin	2026-10-24 09:37:40.402174+05:30	2026-10-24 09:37:40.402174+05:30
54	PO-2026-1049	comp_mashtech	SRU-02		National Safety Equipment Manufacturing Ltd						2026-10-12	\N	\N		1	2	41488.00	7467.84	0.00	0.00	48955.84	Credit 30 Days	Received				Admin	2026-10-24 09:37:40.414186+05:30	2026-10-24 09:37:40.414186+05:30
55	PO-2026-1050	comp_mann	AMD-01		National Safety Equipment Manufacturing Ltd						2026-10-14	\N	\N		1	2	31014.00	5582.52	0.00	0.00	36596.52	Credit 30 Days	Received				Admin	2026-10-24 09:37:40.423251+05:30	2026-10-24 09:37:40.423251+05:30
56	PO-2026-1051	comp_mashtech	AND-01		National Safety Equipment Manufacturing Ltd						2026-10-16	\N	\N		1	2	43643.00	7855.74	0.00	0.00	51498.74	Credit 30 Days	Received				Admin	2026-10-24 09:37:40.433182+05:30	2026-10-24 09:37:40.433182+05:30
57	PO-2026-1052	comp_mashtech	AND-01		National Safety Equipment Manufacturing Ltd						2026-10-20	\N	\N		1	2	39396.00	7091.28	0.00	0.00	46487.28	Credit 30 Days	Received				Admin	2026-10-24 09:37:40.442294+05:30	2026-10-24 09:37:40.442294+05:30
58	PO-2026-1053	comp_mann	AMD-01		National Safety Equipment Manufacturing Ltd						2026-10-22	\N	\N		1	2	40123.00	7222.14	0.00	0.00	47345.14	Credit 30 Days	Received				Admin	2026-10-24 09:37:40.453278+05:30	2026-10-24 09:37:40.453278+05:30
59	5	comp_mann	AMD-01	SUP-002	SafeGuard Industries	SafeGuard Industries	9879123456	orders@safeguard.com	Sector 4, Gandhinagar Industrial Zone, Gujarat	24AAECS9876G1Z3	2026-10-25	2026-11-24	2026-11-01		1	1	1120.00	201.60	0.00	0.00	1321.60	Credit 30 Days	Ordered			• Delivery: Within agreed timeline directly to specified branch warehouse.\n• Packing & Freight: Included in price unless specifically agreed otherwise.\n• Inspection: Subject to quality verification upon delivery; defective items to be replaced within 48h.\n• Payment: As per agreed credit terms against original tax invoice & verified GRN.	Admin	2026-10-25 16:54:39.533797+05:30	2026-10-25 16:54:39.533797+05:30
60	6	comp_mann	AMD-01	SUP-002	SafeGuard Industries	SafeGuard Industries	9879123456	orders@safeguard.com	Sector 4, Gandhinagar Industrial Zone, Gujarat	24AAECS9876G1Z3	2026-10-25	2026-11-24	2026-11-01		1	2	9520.00	1713.60	0.00	0.00	11233.60	Credit 30 Days	GRN Done	GRN-1008	\N	• Delivery: Within agreed timeline directly to specified branch warehouse.\n• Packing & Freight: Included in price unless specifically agreed otherwise.\n• Inspection: Subject to quality verification upon delivery; defective items to be replaced within 48h.\n• Payment: As per agreed credit terms against original tax invoice & verified GRN.	Admin	2026-10-26 15:43:31.263707+05:30	2026-10-27 23:48:57.342955+05:30
\.


--
-- TOC entry 5477 (class 0 OID 26179)
-- Dependencies: 254
-- Data for Name: stock_adjustments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_adjustments (id, adjustment_no, company_id, branch_code, item_name, sku, quantity, loss_value, reason_code, requested_by, request_date, photo_evidence, photo_url, status, reviewed_by, reviewed_at, review_notes, created_at) FROM stdin;
2	ADJ-2025-080	comp_mann	SUR-02	Safety Helmet M-201	SH-M201	1	285.00	HANDLING_CRACK	Amit Kumar (Sales)	2025-10-20	t		PENDING	\N	\N		2026-10-24 17:40:31.382118+05:30
3	ADJ-2025-079	comp_mann	BRD-02	CO2 Fire Extinguisher 2kg	FE-CO2-2	1	2450.00	VALVE_LEAK_DEFECT	Priya Shah (Accountant)	2025-10-19	t		PENDING	\N	\N		2026-10-24 17:40:31.382118+05:30
4	ADJ-2025-004	comp_mann	AMD-01	ABC Dry Powder Fire Ext. 4kg	FE-ABC-4	1	1120.00	DAMAGED_IN_TRANSIT	AMD-01 Inventory Staff	2026-10-25	t	DAMAGE_EVIDENCE_AMD01_041.jpg	APPROVED	Manager Mann	2026-10-25 01:13:26.101615+05:30	All good	2026-10-25 01:08:03.060917+05:30
5	ADJ-2025-005	comp_mann	AMD-01	Safety Helmet ISI	SH-M201	2	900.00	HANDLING_DAMAGE	AMD-01 Staff	2026-10-25	t		APPROVED	Branch Manager	2026-10-25 01:15:10.911254+05:30	Approved write-off	2026-10-25 01:15:10.902165+05:30
6	ADJ-2025-001	comp_mashtech	AND-01	3kVA Online UPS Pure Sine Wave 230V	UPS-3KVA-ON	1	32500.00	DAMAGED_IN_TRANSIT	Branch Receiving Staff	2026-10-25	t		PENDING	\N	\N		2026-10-25 10:32:01.730451+05:30
7	ADJ-APEX-581	comp_apexglobal_a1sf	ASH-01	Commercial Starter Pack Item A	PRD-START-01	1	950.00	DAMAGED_IN_TRANSIT	Branch Receiving Staff	2026-10-25	t		PENDING	\N	\N		2026-10-25 10:33:03.008001+05:30
8	ADJ-ZENI-439	comp_zenithindu_vk4c	HCD-01	Commercial Starter Pack Item A	PRD-START-01	1	950.00	DAMAGED_IN_TRANSIT	Branch Receiving Staff	2026-10-25	t		PENDING	\N	\N		2026-10-25 10:33:03.026659+05:30
9	ADJ-ACME-716	comp_acmetechno_cajc	MUM-01	Commercial Starter Pack Item A	PRD-START-01	1	950.00	DAMAGED_IN_TRANSIT	Branch Receiving Staff	2026-10-25	t		PENDING	\N	\N		2026-10-25 10:33:03.050728+05:30
1	ADJ-2025-081	comp_mann	AMD-01	ABC Fire Extinguisher 4kg	FE-ABC-4	2	2240.00	DAMAGED_IN_TRANSIT	Neha Desai (Warehouse)	2025-10-21	t		REJECTED	Mann Engineers Admin	2026-10-26 15:39:49.713017+05:30	Rejected after physical recount verification	2026-10-24 17:40:31.382118+05:30
10	ADJ-MANN-611	comp_mannengine_s000	MECB	Commercial Starter Pack Item A	PRD-START-01	1	950.00	DAMAGED_IN_TRANSIT	Branch Receiving Staff	2026-10-25	t		APPROVED	Mann Engineers Admin	2026-10-28 11:53:19.092699+05:30	Approved by Owner — stock adjusted in PostgreSQL	2026-10-25 10:33:03.074449+05:30
11	ADJ-2025-011	comp_mann	AMD-01	CO2 Fire Extinguisher 4.5kg	SKU-CO2-45	1	3200.00	TEST_AUDIT	Staff Test	2026-10-28	t		APPROVED	Mann Shah (Owner)	2026-10-28 12:20:36.941321+05:30	Approved during automated verification	2026-10-28 12:20:36.93814+05:30
12	ADJ-2025-012	comp_mann	AMD-01	CO2 Fire Extinguisher 4.5kg	SKU-CO2-45	1	3200.00	DAMAGED_IN_TRANSIT	Staff Test	2026-10-28	t		APPROVED	Mann Shah (Owner)	2026-10-28 12:22:44.933613+05:30	Approved during automated verification	2026-10-28 12:22:44.930936+05:30
13	ADJ-2025-013	comp_mann	AMD-01	ABC Dry Powder Fire Ext. 4kg	FE-ABC-4	1	1120.00	DAMAGED_IN_TRANSIT	Mann Engineers Admin	2026-10-31	f		APPROVED	Mann Engineers Admin	2026-10-31 17:49:00.6789+05:30	Verified and approved physical write-off	2026-10-31 17:48:58.77189+05:30
\.


--
-- TOC entry 5465 (class 0 OID 25998)
-- Dependencies: 242
-- Data for Name: stock_transfers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_transfers (id, transfer_no, company_id, from_branch, to_branch, item_code, item_name, qty, unit_price, total_value, vehicle_no, driver_name, driver_phone, status, transfer_date, received_date, dispatch_notes, received_notes, created_by, created_at, updated_at) FROM stdin;
1	STR-0045	comp_mann	AMD-01	BRD-02	FE-ABC-4	ABC Dry Powder Extinguisher 4kg	12.00	1321.60	15859.20	GJ-01-XX-9821	Ramesh Patel	+91 98250 12345	In Transit	2026-10-24	\N	Urgent transfer for regional petrochemical order		Admin	2026-10-24 09:54:00.166662+05:30	2026-10-24 09:54:00.166662+05:30
2	STR-0044	comp_mann	BRD-02	AMD-01	FE-CO2-2	CO2 Fire Extinguisher 2kg	5.00	2450.00	12250.00	GJ-06-AB-3341	Dilip Vaghela	+91 97240 66789	Received	2026-10-23	2026-10-23 15:54:00.166662+05:30	Surplus rebalancing to flagship hub		Admin	2026-10-24 09:54:00.166662+05:30	2026-10-24 09:54:00.166662+05:30
3	STR-0043	comp_mann	AMD-01	AND-01	SH-M201	Industrial Safety Helmet Yellow	25.00	340.00	8500.00	GJ-01-YY-1234	Mahesh Rathod	+91 99040 22114	Received	2026-10-21	2026-10-22 09:54:00.166662+05:30	Quarterly stock replenishment		Admin	2026-10-24 09:54:00.166662+05:30	2026-10-24 09:54:00.166662+05:30
4	STR-0042	comp_mann	SRU-02	AMD-01	SG-CL01	Anti-Fog Safety Goggles Clear	50.00	115.00	5750.00	GJ-05-ZZ-5522	Sanjay Solanki	+91 98244 88990	Received	2026-10-18	2026-10-19 09:54:00.166662+05:30	Central distribution dispatch		Admin	2026-10-24 09:54:00.166662+05:30	2026-10-24 09:54:00.166662+05:30
5	STR-3822	comp_mann	HAL-01	BRD-02	SH-M201	Safety Helmet M-201 ISI	20.00	336.30	6726.00	GJ-01-TR-4501	Ramesh Patel	+91 98250 12345	In Transit	2026-10-25	\N	Urgent Customer Order		Admin	2026-10-25 15:20:42.411829+05:30	2026-10-25 15:20:42.411829+05:30
6	STR-9021	comp_mann	HAL-01	AMD-01	FB-HVY-2	Heavy Duty Fire Blanket 2x2m Fiberglass	11.00	1475.00	16225.00	GJ-01-TR-4501	Ramesh Patel	+91 98250 12345	In Transit	2026-10-25	\N	Urgent Customer Order		Admin	2026-10-25 16:42:18.423816+05:30	2026-10-25 16:42:18.423816+05:30
7	STR-6313	comp_mann	BRD-02	AMD-01	SM-DET1	Smoke Detector Photoelectric	10.00	1416.00	14160.00	GJ-01-TR-4501	Ramesh Patel	+91 98250 12345	In Transit	2026-10-26	\N	Urgent Customer Order		Admin	2026-10-26 15:06:48.919255+05:30	2026-10-26 15:06:48.919255+05:30
8	STR-4818	comp_mann	HAL-01	AMD-01	FE-CO2-2	CO2 Fire Extinguisher 2kg	10.00	2891.00	28910.00	GJ-01-TR-4501	Ramesh Patel	+91 98250 12345	Received	2026-10-26	2026-10-28 12:54:17.516812+05:30	Urgent Customer Order	Received and verified at AMD-01	Admin	2026-10-26 15:29:42.663225+05:30	2026-10-28 12:54:17.516812+05:30
9	STR-5082	comp_mann	HAL-01	AMD-01	SP-HDR-68	Pendant Sprinkler Head 68°C Red Bulb	10.00	767.00	7670.00	GJ-01-TR-4501	Ramesh Patel	+91 98250 12345	In Transit	2026-10-28	\N	Urgent Customer Order		Admin	2026-10-28 19:20:19.714433+05:30	2026-10-28 19:20:19.714433+05:30
10	STR-7777	comp_mann	BRD-02	AMD-01	FR-SUT5	Fire Retardant Suit Type 5	10.00	5040.00	50400.00	GJ-01-TR-4501	Ramesh Patel	+91 98250 12345	In Transit	2026-11-15	\N	Urgent Customer Order		Admin	2026-11-15 16:20:06.750669+05:30	2026-11-15 16:20:06.750669+05:30
\.


--
-- TOC entry 5453 (class 0 OID 25727)
-- Dependencies: 230
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, user_id, username, email, password_hash, name, role, branch_code, branch_name, is_active, created_at, company_id, company_name, phone, designation, department, salary, joining_date, failed_attempts, locked_until, status) FROM stdin;
1	USR-OWNER-01	owner	owner@mannfire.com	$2a$10$/RU8.c1Rdt2SvM5nrL5NPOIX1L.I8.JYjL4bbjehVrX.dCfzb//oe	Mann Shah (Enterprise Owner)	TENANT_OWNER	*	All Branches (Enterprise HQ)	t	2026-10-22 19:52:58.119938+05:30	comp_mann	Mann Engineers Fire Safety		Staff	Operations	0.00	2026-10-24	0	\N	ACTIVE
3	USR-SUR-02	manager_surat	manager.surat@mannfire.com	$2a$10$TnXZCFM/8nzS.DfPmkEbZ.UULVrnLgbO0X2HkzuJojjK4dupHNhpG	Sanjay Desai	BRANCH_MANAGER	SUR-02	Surat Franchise Outlet	t	2026-10-22 19:52:58.127587+05:30	comp_mann	Mann Engineers Fire Safety		Staff	Operations	0.00	2026-10-24	0	\N	ACTIVE
4	USR-VAD-03	manager_vadodara	manager.vadodara@mannfire.com	$2a$10$SajU8Dd6qq6p9DonrzI3S.Fvs0XHmYVeK4r1wdJPHTPhwlrHT6Dfi	Vikram Mehta	BRANCH_MANAGER	VAD-03	Vadodara Industrial Depot	t	2026-10-22 19:52:58.128111+05:30	comp_mann	Mann Engineers Fire Safety		Staff	Operations	0.00	2026-10-24	0	\N	ACTIVE
279	USR-823943-GAN	owner_1792898823721@apexcorp.com	owner_1792898823721@apexcorp.com	$2a$10$r1MUv688nnyKe1uh7K6RJ.wzxaocEbzw5m38P11bz54cw8G/dPAnO	Apex Admin	TENANT_OWNER	*	All Branches (Master HQ)	t	2026-10-25 08:57:03.809317+05:30	comp_apexglobal_a1sf	Apex Global Enterprises	9998887776	Company Owner	Executive	0.00	2026-10-25	0	\N	ACTIVE
7	USR-MANN-BRD	brd_branch	branch@b.2.com	$2a$10$8.aUV7xnWLPXwYS.QUQMEel1T4J08dOI46ZE9XCYYLIlyw8JaFrom	Brd-Branch Manager	BRANCH_MANAGER	BRD-02	Brd-Branch (Baroda)	t	2026-10-22 21:07:33.233276+05:30	comp_mann	Mann Engineers Fire Safety	+91 98252 55005	Regional Branch Manager	Branch Operations	65000.00	2026-10-24	0	\N	ACTIVE
302	USR-503946-5IK	shahmann85@gmail.com	shahmann85@gmail.com	$2a$10$5sEE.51KY7.11cT1LqwkmONLqH/yRvE1RqYaGpppJJq.3ovjMZ8Xq	Mann Engineers Admin	TENANT_OWNER	*	All Branches (Master HQ)	t	2026-10-25 09:25:03.672677+05:30	comp_mannengine_s000	Mann Engineeers Vadod	8799061100	Company Owner	Executive	0.00	2026-10-25	0	\N	ACTIVE
10	USR-MASH-SRU	sru_branch	branch@b.4.com	$2a$10$c1mgaDvuT0XmHDlFHe952.sMc7HgNUHTjR57ZNVdTN5Xq43aQRXFu	Sru-Branch Manager	BRANCH_MANAGER	SRU-02	Sru-Branch (Surat)	t	2026-10-22 21:07:33.235296+05:30	comp_mashtech	Mash Tech	+91 98254 00010	Branch Head	Branch Operations	64000.00	2026-10-24	0	\N	ACTIVE
105	USR-MVLHUXZ7	nirav_sales	nirav.sales@mannengineers.in	$2a$10$4r2jpVdg7uGSuAmbzdyd5eRRo/6H.1EjsnV11k06h1wm6nX.lCAYK	Nirav Dave	STAFF	AMD-01	Amd-Branch (Ahmedabad)	t	2026-10-24 03:10:49.583087+05:30	comp_mann	Mann Engineers Fire Safety	+91 98251 77889	Field Safety Engineer	Sales & Billing	36000.00	2026-10-23	0	\N	ACTIVE
290	USR-134662-EF2	owner_1792899134424@zenithenterprise.in	owner_1792899134424@zenithenterprise.in	$2a$10$2.fAVPCXsnNVGa4O1yA22OhufAwy0P0xvbDqwspnTpSxFz1AmPewa	Zenith Owner	TENANT_OWNER	*	All Branches (Master HQ)	t	2026-10-25 09:02:14.545842+05:30	comp_zenithindu_vk4c	Zenith Industrial Safety	9727100200	Company Owner	Executive	0.00	2026-10-25	0	\N	ACTIVE
291	USR-350361-YCZ	owner_pilot@enterprise.in	owner_pilot@enterprise.in	$2a$10$PtVEVXD1yawiGV/o7nTmTeoFaVd9V5WLhGpLSzxu2cgU6n9/n4yPq	Acme Technologies Pvt Ltd Admin	TENANT_OWNER	*	All Branches (Master HQ)	t	2026-10-25 09:05:50.198483+05:30	comp_acmetechno_cajc	Acme Technologies Pvt Ltd	9876543210	Company Owner	Executive	0.00	2026-10-25	0	\N	ACTIVE
2	USR-AMD-01	manager_amd	manager.amd@mannfire.com	$2a$10$1hgrgho8Ml.T5tBttS0mruvROZedbnRmsfnCwegOQzcyJTF3ZPmOm	Pravin Patel	BRANCH_MANAGER	AMD-01	Ahmedabad Central Hub & Warehouse	t	2026-10-22 19:52:58.126926+05:30	comp_mann	Mann Engineers Fire Safety		Staff	Operations	0.00	2026-10-24	0	\N	ACTIVE
5	USR-MANN-ADMIN	admin_mann	admin@a.1.com	$2a$10$oD54AM96r4yJkDsU8Q3Z8uCj7gUiggGe7gdfu0KneIBbkqMFqZUEy	Mann Engineers Admin	TENANT_OWNER	*	All Branches (Master HQ)	t	2026-10-22 21:07:33.230364+05:30	comp_mann	Mann Engineers Fire Safety	+91 98250 11001	Managing Director & Platform Owner	Executive Board	125000.00	2026-10-24	0	\N	ACTIVE
6	USR-MANN-AMD	amd_branch	branch@b.1.com	$2a$10$LeNRDn1RV.58cMMmPWySLuX1fehSSHKvU8E2abSwI3LKW03dzkRJW	Amd-Branch Manager	BRANCH_MANAGER	AMD-01	Amd-Branch (Ahmedabad)	t	2026-10-22 21:07:33.232707+05:30	comp_mann	Mann Engineers Fire Safety	+91 98251 22002	General Branch Manager	Branch Operations	68000.00	2026-10-24	0	\N	ACTIVE
100	USR-MANN-BRD-02	bhavik_tech	bhavik.tech@mannengineers.in	$2a$10$WbUAnlsF4MNfqFpla3hU5eP.nKPOt2YzPH4Wzym4Ymuvc45PoR4Fe	Bhavik Dave	STAFF	BRD-02	Brd-Branch (Baroda)	t	2026-10-24 02:49:05.913706+05:30	comp_mann	Mann Engineers Fire Safety	+91 98252 66006	Senior Safety Systems Technician	Technical Services	40000.00	2024-01-15	0	\N	ACTIVE
97	USR-MANN-AMD-02	kishan_sales	kishan.sales@mannengineers.in	$2a$10$HahVcSpQib0e0qLK9RRpA.n79NdGiG9ZnCDkjYnjZzBhCzJfReELO	Kishan Panchal	STAFF	AMD-01	Amd-Branch (Ahmedabad)	t	2026-10-24 02:49:05.910974+05:30	comp_mann	Mann Engineers Fire Safety	+91 98251 33003	Senior POS & Counter Sales Officer	Sales & Billing	38000.00	2023-08-01	0	\N	ACTIVE
101	USR-MANN-BRD-03	pooja_cashier	pooja.cashier@mannengineers.in	$2a$10$CF/3r/mdOYvcBAQTGPkp8eSZDpNAUlo4mMJGbB4mrI8.dZPCxcuKK	Pooja Sharma	STAFF	BRD-02	Brd-Branch (Baroda)	t	2026-10-24 02:49:05.914169+05:30	comp_mann	Mann Engineers Fire Safety	+91 98252 77007	Accounts & Billing Cashier	Finance & Accounts	32000.00	2024-03-01	0	\N	ACTIVE
8	USR-MASH-ADMIN	admin_mash	admin@a.2.com	$2a$10$qoief65ZZPwYz2X10vKK5.SB6lEQav052hKjfItS02HDLba5ECPHe	Mash Tech Admin	TENANT_OWNER	*	All Branches (Tech HQ)	t	2026-10-22 21:07:33.23389+05:30	comp_mashtech	Mash Tech	+91 98253 88008	Executive Director	Executive Board	110000.00	2026-10-24	0	\N	ACTIVE
98	USR-MANN-AMD-03	mahesh_stock	mahesh.stock@mannengineers.in	$2a$10$XJWL.9dRkjjB2YY2o/RCaOEMDyHg4f6znWQPalJnXmIS6CFG466VO	Mahesh Solanki	STAFF	AMD-01	Amd-Branch (Ahmedabad)	t	2026-10-24 02:49:05.912439+05:30	comp_mann	Mann Engineers Fire Safety	+91 98251 44004	Inventory & Logistics Supervisor	Warehouse & Stores	35000.00	2023-11-10	0	\N	ACTIVE
9	USR-MASH-AND	and_branch	branch@b.3.com	$2a$10$5wim0fA9US0qzm7LHcqKg.U6mm5cLXScGQ/pxhfp1BTt9EVEw6Eh.	And-Branch Manager	BRANCH_MANAGER	AND-01	And-Branch (Anand)	t	2026-10-22 21:07:33.234667+05:30	comp_mashtech	Mash Tech	+91 98253 99009	Branch Head	Branch Operations	62000.00	2026-10-24	0	\N	ACTIVE
\.


--
-- TOC entry 5509 (class 0 OID 0)
-- Dependencies: 247
-- Name: account_vouchers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.account_vouchers_id_seq', 18, true);


--
-- TOC entry 5510 (class 0 OID 0)
-- Dependencies: 257
-- Name: branch_shrink_benchmarks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.branch_shrink_benchmarks_id_seq', 9, true);


--
-- TOC entry 5511 (class 0 OID 0)
-- Dependencies: 243
-- Name: branch_stock_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.branch_stock_id_seq', 113, true);


--
-- TOC entry 5512 (class 0 OID 0)
-- Dependencies: 237
-- Name: branches_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.branches_id_seq', 111, true);


--
-- TOC entry 5513 (class 0 OID 0)
-- Dependencies: 235
-- Name: cash_book_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cash_book_id_seq', 364, true);


--
-- TOC entry 5514 (class 0 OID 0)
-- Dependencies: 227
-- Name: cat_sub_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cat_sub_id_seq', 11, true);


--
-- TOC entry 5515 (class 0 OID 0)
-- Dependencies: 245
-- Name: chart_of_accounts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.chart_of_accounts_id_seq', 39, true);


--
-- TOC entry 5516 (class 0 OID 0)
-- Dependencies: 239
-- Name: customer_holds_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.customer_holds_id_seq', 5, true);


--
-- TOC entry 5517 (class 0 OID 0)
-- Dependencies: 221
-- Name: customers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.customers_id_seq', 8, true);


--
-- TOC entry 5518 (class 0 OID 0)
-- Dependencies: 255
-- Name: cycle_counts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cycle_counts_id_seq', 39, true);


--
-- TOC entry 5519 (class 0 OID 0)
-- Dependencies: 249
-- Name: financial_periods_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.financial_periods_id_seq', 38, true);


--
-- TOC entry 5520 (class 0 OID 0)
-- Dependencies: 225
-- Name: invoice_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.invoice_items_id_seq', 565, true);


--
-- TOC entry 5521 (class 0 OID 0)
-- Dependencies: 223
-- Name: invoices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.invoices_id_seq', 284, true);


--
-- TOC entry 5522 (class 0 OID 0)
-- Dependencies: 251
-- Name: loss_alerts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.loss_alerts_id_seq', 14, true);


--
-- TOC entry 5523 (class 0 OID 0)
-- Dependencies: 219
-- Name: product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_id_seq', 864, true);


--
-- TOC entry 5524 (class 0 OID 0)
-- Dependencies: 233
-- Name: purchase_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.purchase_items_id_seq', 10, true);


--
-- TOC entry 5525 (class 0 OID 0)
-- Dependencies: 231
-- Name: purchases_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.purchases_id_seq', 60, true);


--
-- TOC entry 5526 (class 0 OID 0)
-- Dependencies: 253
-- Name: stock_adjustments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stock_adjustments_id_seq', 13, true);


--
-- TOC entry 5527 (class 0 OID 0)
-- Dependencies: 241
-- Name: stock_transfers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stock_transfers_id_seq', 10, true);


--
-- TOC entry 5528 (class 0 OID 0)
-- Dependencies: 229
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 582, true);


--
-- TOC entry 5269 (class 2606 OID 26120)
-- Name: account_vouchers account_vouchers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_vouchers
    ADD CONSTRAINT account_vouchers_pkey PRIMARY KEY (id);


--
-- TOC entry 5288 (class 2606 OID 26271)
-- Name: branch_shrink_benchmarks branch_shrink_benchmarks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branch_shrink_benchmarks
    ADD CONSTRAINT branch_shrink_benchmarks_pkey PRIMARY KEY (id);


--
-- TOC entry 5262 (class 2606 OID 26058)
-- Name: branch_stock branch_stock_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branch_stock
    ADD CONSTRAINT branch_stock_pkey PRIMARY KEY (id);


--
-- TOC entry 5250 (class 2606 OID 25931)
-- Name: branches branches_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branches
    ADD CONSTRAINT branches_pkey PRIMARY KEY (id);


--
-- TOC entry 5246 (class 2606 OID 25903)
-- Name: cash_book cash_book_company_branch_entryno_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cash_book
    ADD CONSTRAINT cash_book_company_branch_entryno_key UNIQUE (company_id, branch_code, entry_no);


--
-- TOC entry 5248 (class 2606 OID 25901)
-- Name: cash_book cash_book_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cash_book
    ADD CONSTRAINT cash_book_pkey PRIMARY KEY (id);


--
-- TOC entry 5230 (class 2606 OID 25721)
-- Name: cat_sub cat_sub_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cat_sub
    ADD CONSTRAINT cat_sub_pkey PRIMARY KEY (id);


--
-- TOC entry 5266 (class 2606 OID 26097)
-- Name: chart_of_accounts chart_of_accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chart_of_accounts
    ADD CONSTRAINT chart_of_accounts_pkey PRIMARY KEY (id);


--
-- TOC entry 5291 (class 2606 OID 26336)
-- Name: companies companies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (id);


--
-- TOC entry 5254 (class 2606 OID 25996)
-- Name: customer_holds customer_holds_comp_branch_holdno_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_holds
    ADD CONSTRAINT customer_holds_comp_branch_holdno_key UNIQUE (company_id, branch_code, hold_no);


--
-- TOC entry 5256 (class 2606 OID 25994)
-- Name: customer_holds customer_holds_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_holds
    ADD CONSTRAINT customer_holds_pkey PRIMARY KEY (id);


--
-- TOC entry 5220 (class 2606 OID 25554)
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);


--
-- TOC entry 5222 (class 2606 OID 25556)
-- Name: customers customers_uid_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_uid_key UNIQUE (uid);


--
-- TOC entry 5283 (class 2606 OID 26243)
-- Name: cycle_counts cycle_counts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cycle_counts
    ADD CONSTRAINT cycle_counts_pkey PRIMARY KEY (id);


--
-- TOC entry 5285 (class 2606 OID 26245)
-- Name: cycle_counts cycle_counts_session_no_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cycle_counts
    ADD CONSTRAINT cycle_counts_session_no_key UNIQUE (session_no);


--
-- TOC entry 5272 (class 2606 OID 26151)
-- Name: financial_periods financial_periods_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.financial_periods
    ADD CONSTRAINT financial_periods_pkey PRIMARY KEY (id);


--
-- TOC entry 5228 (class 2606 OID 25623)
-- Name: invoice_items invoice_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_items
    ADD CONSTRAINT invoice_items_pkey PRIMARY KEY (id);


--
-- TOC entry 5224 (class 2606 OID 34633)
-- Name: invoices invoices_company_branch_invno_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_company_branch_invno_key UNIQUE (company_id, branch_code, invoice_no);


--
-- TOC entry 5226 (class 2606 OID 25594)
-- Name: invoices invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_pkey PRIMARY KEY (id);


--
-- TOC entry 5276 (class 2606 OID 26176)
-- Name: loss_alerts loss_alerts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loss_alerts
    ADD CONSTRAINT loss_alerts_pkey PRIMARY KEY (id);


--
-- TOC entry 5216 (class 2606 OID 25526)
-- Name: product product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_pkey PRIMARY KEY (id);


--
-- TOC entry 5244 (class 2606 OID 25862)
-- Name: purchase_items purchase_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_items
    ADD CONSTRAINT purchase_items_pkey PRIMARY KEY (id);


--
-- TOC entry 5240 (class 2606 OID 25835)
-- Name: purchases purchases_company_branch_pono_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchases
    ADD CONSTRAINT purchases_company_branch_pono_key UNIQUE (company_id, branch_code, po_no);


--
-- TOC entry 5242 (class 2606 OID 25833)
-- Name: purchases purchases_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchases
    ADD CONSTRAINT purchases_pkey PRIMARY KEY (id);


--
-- TOC entry 5279 (class 2606 OID 26211)
-- Name: stock_adjustments stock_adjustments_adjustment_no_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_adjustments
    ADD CONSTRAINT stock_adjustments_adjustment_no_key UNIQUE (adjustment_no);


--
-- TOC entry 5281 (class 2606 OID 26209)
-- Name: stock_adjustments stock_adjustments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_adjustments
    ADD CONSTRAINT stock_adjustments_pkey PRIMARY KEY (id);


--
-- TOC entry 5258 (class 2606 OID 26030)
-- Name: stock_transfers stock_transfers_comp_transno_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_transfers
    ADD CONSTRAINT stock_transfers_comp_transno_key UNIQUE (company_id, transfer_no);


--
-- TOC entry 5260 (class 2606 OID 26028)
-- Name: stock_transfers stock_transfers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_transfers
    ADD CONSTRAINT stock_transfers_pkey PRIMARY KEY (id);


--
-- TOC entry 5264 (class 2606 OID 26060)
-- Name: branch_stock uq_branch_stock; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branch_stock
    ADD CONSTRAINT uq_branch_stock UNIQUE (company_id, branch_code, pid);


--
-- TOC entry 5252 (class 2606 OID 25933)
-- Name: branches uq_company_branch_code; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branches
    ADD CONSTRAINT uq_company_branch_code UNIQUE (company_id, code);


--
-- TOC entry 5218 (class 2606 OID 34631)
-- Name: product uq_product_comp_pid; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT uq_product_comp_pid UNIQUE (company_id, pid);


--
-- TOC entry 5232 (class 2606 OID 25751)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 5234 (class 2606 OID 25745)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 5236 (class 2606 OID 25747)
-- Name: users users_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_user_id_key UNIQUE (user_id);


--
-- TOC entry 5238 (class 2606 OID 25749)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 5277 (class 1259 OID 26212)
-- Name: idx_adjustments_company; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_adjustments_company ON public.stock_adjustments USING btree (company_id);


--
-- TOC entry 5267 (class 1259 OID 26098)
-- Name: idx_coa_company; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_coa_company ON public.chart_of_accounts USING btree (company_id);


--
-- TOC entry 5286 (class 1259 OID 26246)
-- Name: idx_counts_company; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_counts_company ON public.cycle_counts USING btree (company_id);


--
-- TOC entry 5274 (class 1259 OID 26177)
-- Name: idx_loss_alerts_company; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_loss_alerts_company ON public.loss_alerts USING btree (company_id);


--
-- TOC entry 5273 (class 1259 OID 26152)
-- Name: idx_periods_company; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_periods_company ON public.financial_periods USING btree (company_id, fiscal_year);


--
-- TOC entry 5289 (class 1259 OID 26272)
-- Name: idx_shrink_company; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_shrink_company ON public.branch_shrink_benchmarks USING btree (company_id);


--
-- TOC entry 5270 (class 1259 OID 26126)
-- Name: idx_vouchers_account; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vouchers_account ON public.account_vouchers USING btree (account_id);


--
-- TOC entry 5294 (class 2606 OID 26121)
-- Name: account_vouchers account_vouchers_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_vouchers
    ADD CONSTRAINT account_vouchers_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.chart_of_accounts(id) ON DELETE CASCADE;


--
-- TOC entry 5292 (class 2606 OID 25624)
-- Name: invoice_items invoice_items_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_items
    ADD CONSTRAINT invoice_items_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(id) ON DELETE CASCADE;


--
-- TOC entry 5293 (class 2606 OID 25863)
-- Name: purchase_items purchase_items_purchase_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_items
    ADD CONSTRAINT purchase_items_purchase_id_fkey FOREIGN KEY (purchase_id) REFERENCES public.purchases(id) ON DELETE CASCADE;


-- Completed on 2026-11-15 18:00:18

--
-- PostgreSQL database dump complete
--

\unrestrict gYvvZAwMSFGYw5kY9nh4bZDsKhiarXLTysEXO6U8lIJ0QLhVGjapQ0lXrRqiGOC

