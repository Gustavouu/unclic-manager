# Supabase Schema e Infraestrutura

Este documento descreve o schema completo do banco de dados, as políticas de segurança (RLS), as APIs e as edge functions necessárias para integrar o backend com o frontend, garantindo que todos os problemas mapeados sejam resolvidos.

## Tabelas

### 1. `auth.users` (Gerenciado pelo Supabase Auth)
- **Colunas:**
  - `id` (uuid, primary key)
  - `email` (text, unique, not null)
  - `encrypted_password` (text)
  - `email_confirmed_at` (timestamp with time zone)
  - `invited_at` (timestamp with time zone)
  - `confirmation_token` (text)
  - `confirmation_sent_at` (timestamp with time zone)
  - `recovery_token` (text)
  - `recovery_sent_at` (timestamp with time zone)
  - `email_change_token_new` (text)
  - `email_change` (text)
  - `email_change_sent_at` (timestamp with time zone)
  - `last_sign_in_at` (timestamp with time zone)
  - `raw_app_meta_data` (jsonb)
  - `raw_user_meta_data` (jsonb)
  - `is_super_admin` (boolean)
  - `created_at` (timestamp with time zone)
  - `updated_at` (timestamp with time zone)
  - `phone` (text)
  - `phone_confirmed_at` (timestamp with time zone)
  - `phone_change` (text)
  - `phone_change_token` (text)
  - `phone_change_sent_at` (timestamp with time zone)
  - `confirmed_at` (timestamp with time zone)
  - `email_change_token_current` (text)
  - `banned_until` (timestamp with time zone)
  - `reauthentication_token` (text)
  - `reauthentication_sent_at` (timestamp with time zone)

### 2. `public.profiles`
- **Colunas:**
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key referencing `auth.users.id`)
  - `full_name` (text)
  - `avatar_url` (text)
  - `phone` (text)
  - `birth_date` (date)
  - `tax_id` (text)
  - `created_at` (timestamp with time zone, default: now())
  - `updated_at` (timestamp with time zone, default: now())

### 3. `public.businesses`
- **Colunas:**
  - `id` (uuid, primary key)
  - `name` (text, not null)
  - `slug` (text, unique)
  - `admin_email` (text)
  - `phone` (text)
  - `zip_code` (text)
  - `address` (text)
  - `address_number` (text)
  - `address_complement` (text)
  - `neighborhood` (text)
  - `city` (text)
  - `state` (text)
  - `latitude` (float)
  - `longitude` (float)
  - `logo_url` (text)
  - `description` (text)
  - `ein` (text)
  - `legal_name` (text)
  - `trade_name` (text)
  - `status` (text, default: 'active')
  - `subscription_status` (text, default: 'trial')
  - `subscription_end_date` (timestamp with time zone)
  - `trial_end_date` (timestamp with time zone)
  - `timezone` (text, default: 'America/Sao_Paulo')
  - `currency` (text, default: 'BRL')
  - `language` (text, default: 'pt-BR')
  - `created_at` (timestamp with time zone, default: now())
  - `updated_at` (timestamp with time zone, default: now())

### 4. `public.business_users`
- **Colunas:**
  - `id` (uuid, primary key)
  - `business_id` (uuid, foreign key referencing `businesses.id`)
  - `user_id` (uuid, foreign key referencing `auth.users.id`)
  - `role` (text) // 'owner', 'admin', 'staff', 'professional'
  - `created_at` (timestamp with time zone, default: now())
  - `updated_at` (timestamp with time zone, default: now())

### 5. `public.permissions`
- **Colunas:**
  - `id` (uuid, primary key)
  - `business_id` (uuid, foreign key referencing `businesses.id`)
  - `user_id` (uuid, foreign key referencing `auth.users.id`)
  - `resource` (text) // 'appointments', 'clients', 'services', etc.
  - `action` (text) // 'create', 'read', 'update', 'delete'
  - `created_at` (timestamp with time zone, default: now())
  - `updated_at` (timestamp with time zone, default: now())

### 6. `public.professionals`
- **Colunas:**
  - `id` (uuid, primary key)
  - `business_id` (uuid, foreign key referencing `businesses.id`)
  - `user_id` (uuid, foreign key referencing `auth.users.id`)
  - `name` (text)
  - `email` (text)
  - `phone` (text)
  - `position` (text)
  - `bio` (text)
  - `photo_url` (text)
  - `specialties` (text[])
  - `commission_percentage` (float, default: 0)
  - `hire_date` (date)
  - `status` (text, default: 'active')
  - `working_hours` (jsonb)
  - `created_at` (timestamp with time zone, default: now())
  - `updated_at` (timestamp with time zone, default: now())

### 7. `public.clients`
- **Colunas:**
  - `id` (uuid, primary key)
  - `business_id` (uuid, foreign key referencing `businesses.id`)
  - `user_id` (uuid, foreign key referencing `auth.users.id`)
  - `name` (text)
  - `email` (text)
  - `phone` (text)
  - `birth_date` (date)
  - `gender` (text)
  - `address` (text)
  - `city` (text)
  - `state` (text)
  - `zip_code` (text)
  - `notes` (text)
  - `last_visit` (timestamp with time zone)
  - `total_spent` (float, default: 0)
  - `preferences` (jsonb)
  - `tags` (text[])
  - `created_at` (timestamp with time zone, default: now())
  - `updated_at` (timestamp with time zone, default: now())

### 8. `public.service_categories`
- **Colunas:**
  - `id` (uuid, primary key)
  - `business_id` (uuid, foreign key referencing `businesses.id`)
  - `name` (text)
  - `description` (text)
  - `color` (text)
  - `icon` (text)
  - `display_order` (integer, default: 0)
  - `is_active` (boolean, default: true)
  - `created_at` (timestamp with time zone, default: now())
  - `updated_at` (timestamp with time zone, default: now())

### 9. `public.services`
- **Colunas:**
  - `id` (uuid, primary key)
  - `business_id` (uuid, foreign key referencing `businesses.id`)
  - `category_id` (uuid, foreign key referencing `service_categories.id`)
  - `name` (text)
  - `description` (text)
  - `duration` (integer) // em minutos
  - `price` (float)
  - `cost` (float)
  - `commission_percentage` (float, default: 0)
  - `is_active` (boolean, default: true)
  - `allow_online_booking` (boolean, default: true)
  - `buffer_time_before` (integer) // em minutos
  - `buffer_time_after` (integer) // em minutos
  - `color` (text)
  - `image_url` (text)
  - `created_at` (timestamp with time zone, default: now())
  - `updated_at` (timestamp with time zone, default: now())

### 10. `public.professional_services`
- **Colunas:**
  - `id` (uuid, primary key)
  - `professional_id` (uuid, foreign key referencing `professionals.id`)
  - `service_id` (uuid, foreign key referencing `services.id`)
  - `custom_price` (float)
  - `custom_duration` (integer)
  - `is_active` (boolean, default: true)
  - `created_at` (timestamp with time zone, default: now())
  - `updated_at` (timestamp with time zone, default: now())

### 11. `public.appointments`
- **Colunas:**
  - `id` (uuid, primary key)
  - `business_id` (uuid, foreign key referencing `businesses.id`)
  - `client_id` (uuid, foreign key referencing `clients.id`)
  - `professional_id` (uuid, foreign key referencing `professionals.id`)
  - `date` (date)
  - `start_time` (time)
  - `end_time` (time)
  - `duration` (integer) // em minutos
  - `total_price` (float)
  - `status` (text) // 'scheduled', 'confirmed', 'completed', 'cancelled', 'no_show'
  - `payment_method` (text)
  - `notes` (text)
  - `reminder_sent` (boolean, default: false)
  - `rating` (integer)
  - `feedback_comment` (text)
  - `notification_config` (jsonb)
  - `created_at` (timestamp with time zone, default: now())
  - `updated_at` (timestamp with time zone, default: now())

### 12. `public.appointment_services`
- **Colunas:**
  - `id` (uuid, primary key)
  - `appointment_id` (uuid, foreign key referencing `appointments.id`)
  - `service_id` (uuid, foreign key referencing `services.id`)
  - `price` (float)
  - `duration` (integer)
  - `discount` (float)
  - `notes` (text)
  - `created_at` (timestamp with time zone, default: now())
  - `updated_at` (timestamp with time zone, default: now())

### 13. `public.availabilities`
- **Colunas:**
  - `id` (uuid, primary key)
  - `business_id` (uuid, foreign key referencing `businesses.id`)
  - `professional_id` (uuid, foreign key referencing `professionals.id`)
  - `service_id` (uuid, foreign key referencing `services.id`)
  - `day_of_week` (integer) // 0=domingo, 6=sábado
  - `start_time` (time)
  - `end_time` (time)
  - `is_off_day` (boolean, default: false)
  - `custom_date` (date)
  - `simultaneous_capacity` (integer, default: 1)
  - `interval_between` (integer, default: 0) // em minutos
  - `created_at` (timestamp with time zone, default: now())
  - `updated_at` (timestamp with time zone, default: now())

### 14. `public.products`
- **Colunas:**
  - `id` (uuid, primary key)
  - `business_id` (uuid, foreign key referencing `businesses.id`)
  - `name` (text)
  - `sku` (text)
  - `barcode` (text)
  - `description` (text)
  - `cost_price` (float)
  - `sale_price` (float)
  - `min_stock` (float)
  - `unit` (text, default: 'UNIT')
  - `image` (text)
  - `is_active` (boolean, default: true)
  - `is_sellable` (boolean, default: true)
  - `is_service` (boolean, default: false)
  - `created_at` (timestamp with time zone, default: now())
  - `updated_at` (timestamp with time zone, default: now())

### 15. `public.service_products`
- **Colunas:**
  - `id` (uuid, primary key)
  - `service_id` (uuid, foreign key referencing `services.id`)
  - `product_id` (uuid, foreign key referencing `products.id`)
  - `quantity` (float)
  - `created_at` (timestamp with time zone, default: now())
  - `updated_at` (timestamp with time zone, default: now())

### 16. `public.stock_items`
- **Colunas:**
  - `id` (uuid, primary key)
  - `business_id` (uuid, foreign key referencing `businesses.id`)
  - `establishment_id` (uuid)
  - `product_id` (uuid, foreign key referencing `products.id`)
  - `quantity` (float)
  - `batch_number` (text)
  - `expiry_date` (date)
  - `created_at` (timestamp with time zone, default: now())
  - `updated_at` (timestamp with time zone, default: now())

### 17. `public.stock_movements`
- **Colunas:**
  - `id` (uuid, primary key)
  - `business_id` (uuid, foreign key referencing `businesses.id`)
  - `establishment_id` (uuid)
  - `product_id` (uuid, foreign key referencing `products.id`)
  - `quantity` (float)
  - `type` (text) // 'IN', 'OUT', 'ADJUSTMENT'
  - `reason` (text) // 'PURCHASE', 'SALE', 'EXPIRY', 'DAMAGE', 'INVENTORY'
  - `notes` (text)
  - `batch_number` (text)
  - `expiry_date` (date)
  - `created_by_id` (uuid, foreign key referencing `auth.users.id`)
  - `created_at` (timestamp with time zone, default: now())

### 18. `public.inventory_items`
- **Colunas:**
  - `id` (uuid, primary key)
  - `business_id` (uuid, foreign key referencing `businesses.id`)
  - `name` (text)
  - `description` (text)
  - `quantity` (integer, default: 0)
  - `min_quantity` (integer, default: 5)
  - `cost_price` (float)
  - `sale_price` (float)
  - `category_id` (text)
  - `supplier_id` (text)
  - `expiry_date` (date)
  - `is_equipment` (boolean, default: false)
  - `last_restock_date` (date)
  - `sku` (text)
  - `barcode` (text)
  - `location` (text)
  - `image_url` (text)
  - `created_at` (timestamp with time zone, default: now())
  - `updated_at` (timestamp with time zone, default: now())

### 19. `public.financial_accounts`
- **Colunas:**
  - `id` (uuid, primary key)
  - `business_id` (uuid, foreign key referencing `businesses.id`)
  - `establishment_id` (uuid)
  - `name` (text)
  - `type` (text) // 'CASH', 'BANK', 'CREDIT_CARD', 'DIGITAL'
  - `bank` (text)
  - `agency` (text)
  - `account_number` (text)
  - `description` (text)
  - `initial_balance` (float, default: 0)
  - `current_balance` (float, default: 0)
  - `is_active` (boolean, default: true)
  - `created_at` (timestamp with time zone, default: now())
  - `updated_at` (timestamp with time zone, default: now())

### 20. `public.financial_categories`
- **Colunas:**
  - `id` (uuid, primary key)
  - `business_id` (uuid, foreign key referencing `businesses.id`)
  - `name` (text)
  - `parent_id` (uuid)
  - `type` (text) // 'INCOME', 'EXPENSE'
  - `color` (text)
  - `icon` (text)
  - `is_active` (boolean, default: true)
  - `created_at` (timestamp with time zone, default: now())
  - `updated_at` (timestamp with time zone, default: now())

### 21. `public.transactions`
- **Colunas:**
  - `id` (uuid, primary key)
  - `business_id` (uuid, foreign key referencing `businesses.id`)
  - `account_id` (uuid, foreign key referencing `financial_accounts.id`)
  - `category_id` (uuid, foreign key referencing `financial_categories.id`)
  - `appointment_id` (uuid, foreign key referencing `appointments.id`)
  - `client_id` (uuid, foreign key referencing `clients.id`)
  - `description` (text)
  - `amount` (float)
  - `type` (text) // 'INCOME', 'EXPENSE'
  - `status` (text) // 'PENDING', 'PAID', 'CANCELLED'
  - `payment_method` (text)
  - `payment_gateway_id` (text)
  - `payment_gateway_data` (jsonb)
  - `due_date` (date)
  - `payment_date` (date)
  - `document` (text)
  - `notes` (text)
  - `created_by_id` (uuid, foreign key referencing `auth.users.id`)
  - `created_at` (timestamp with time zone, default: now())
  - `updated_at` (timestamp with time zone, default: now())

### 22. `public.commissions`
- **Colunas:**
  - `id` (uuid, primary key)
  - `professional_id` (uuid, foreign key referencing `professionals.id`)
  - `appointment_id` (uuid, foreign key referencing `appointments.id`)
  - `financial_transaction_id` (uuid, foreign key referencing `transactions.id`)
  - `amount` (float)
  - `status` (text) // 'PENDING', 'PAID', 'CANCELLED'
  - `paid_at` (timestamp with time zone)
  - `created_at` (timestamp with time zone, default: now())
  - `updated_at` (timestamp with time zone, default: now())

### 23. `public.loyalty_programs`
- **Colunas:**
  - `id` (uuid, primary key)
  - `business_id` (uuid, foreign key referencing `businesses.id`)
  - `name` (text)
  - `description` (text)
  - `is_active` (boolean, default: true)
  - `created_at` (timestamp with time zone, default: now())
  - `updated_at` (timestamp with time zone, default: now())

### 24. `public.loyalty_levels`
- **Colunas:**
  - `id` (uuid, primary key)
  - `loyalty_program_id` (uuid, foreign key referencing `loyalty_programs.id`)
  - `name` (text)
  - `description` (text)
  - `points_required` (integer)
  - `benefits` (jsonb)
  - `color` (text)
  - `icon` (text)
  - `is_active` (boolean, default: true)
  - `created_at` (timestamp with time zone, default: now())
  - `updated_at` (timestamp with time zone, default: now())

### 25. `public.loyalty_rules`
- **Colunas:**
  - `id` (uuid, primary key)
  - `loyalty_program_id` (uuid, foreign key referencing `loyalty_programs.id`)
  - `name` (text)
  - `description` (text)
  - `action` (text) // 'PURCHASE', 'APPOINTMENT', 'REGISTRATION', 'BIRTHDAY', 'CUSTOM'
  - `points_value` (integer)
  - `min_transaction_value` (float)
  - `service_ids` (text[])
  - `product_ids` (text[])
  - `is_active` (boolean, default: true)
  - `created_at` (timestamp with time zone, default: now())
  - `updated_at` (timestamp with time zone, default: now())

### 26. `public.loyalty_cards`
- **Colunas:**
  - `id` (uuid, primary key)
  - `loyalty_program_id` (uuid, foreign key referencing `loyalty_programs.id`)
  - `customer_id` (uuid, foreign key referencing `clients.id`)
  - `loyalty_level_id` (uuid, foreign key referencing `loyalty_levels.id`)
  - `current_points` (integer, default: 0)
  - `total_earned_points` (integer, default: 0)
  - `total_redeemed_points` (integer, default: 0)
  - `is_active` (boolean, default: true)
  - `created_at` (timestamp with time zone, default: now())
  - `updated_at` (timestamp with time zone, default: now())

### 27. `public.loyalty_transactions`
- **Colunas:**
  - `id` (uuid, primary key)
  - `loyalty_card_id` (uuid, foreign key referencing `loyalty_cards.id`)
  - `description` (text)
  - `points` (integer)
  - `type` (text) // 'EARN', 'REDEEM', 'EXPIRE', 'ADJUST'
  - `appointment_id` (uuid)
  - `financial_transaction_id` (uuid, foreign key referencing `transactions.id`)
  - `expires_at` (timestamp with time zone)
  - `created_at` (timestamp with time zone, default: now())

### 28. `public.marketing_consents`
- **Colunas:**
  - `id` (uuid, primary key)
  - `customer_id` (uuid, foreign key referencing `clients.id`)
  - `channel` (text) // 'EMAIL', 'SMS', 'WHATSAPP', 'PUSH'
  - `consented` (boolean, default: false)
  - `consented_at` (timestamp with time zone)
  - `revoked_at` (timestamp with time zone)
  - `created_at` (timestamp with time zone, default: now())
  - `updated_at` (timestamp with time zone, default: now())

### 29. `public.business_settings`
- **Colunas:**
  - `id` (uuid, primary key)
  - `business_id` (uuid, foreign key referencing `businesses.id`)
  - `allow_remote_queue` (boolean, default: true)
  - `remote_queue_limit` (integer, default: 10)
  - `require_advance_payment` (boolean, default: false)
  - `minimum_notice_time` (integer, default: 30)
  - `maximum_days_in_advance` (integer, default: 30)
  - `allow_simultaneous_appointments` (boolean, default: true)
  - `require_manual_confirmation` (boolean, default: false)
  - `block_no_show_clients` (boolean, default: false)
  - `send_email_confirmation` (boolean, default: true)
  - `send_reminders` (boolean, default: true)
  - `reminder_hours` (integer, default: 24)
  - `send_followup_message` (boolean, default: false)
  - `followup_hours` (integer, default: 2)
  - `cancellation_policy_hours` (integer, default: 24)
  - `no_show_fee` (float, default: 0)
  - `primary_color` (text, default: '#213858')
  - `secondary_color` (text, default: '#33c3f0')
  - `logo_url` (text)
  - `banner_url` (text)
  - `cancellation_policy` (text)
  - `cancellation_message` (text)
  - `created_at` (timestamp with time zone, default: now())
  - `updated_at` (timestamp with time zone, default: now())

### 30. `public.integrations`
- **Colunas:**
  - `id` (uuid, primary key)
  - `business_id` (uuid, foreign key referencing `businesses.id`)
  - `provider_name` (text)
  - `type` (text)
  - `is_active` (boolean, default: true)
  - `access_token` (text)
  - `refresh_token` (text)
  - `token_expires_at` (timestamp with time zone)
  - `configuration` (jsonb, default: '{}')
  - `last_sync_at` (timestamp with time zone)
  - `last_sync_status` (text)
  - `created_at` (timestamp with time zone, default: now())
  - `updated_at` (timestamp with time zone, default: now())

### 31. `public.webhook_events`
- **Colunas:**
  - `id` (uuid, primary key)
  - `business_id` (uuid, foreign key referencing `businesses.id`)
  - `provider` (text)
  - `event_type` (text)
  - `event_id` (text)
  - `payload` (jsonb)
  - `processed` (boolean, default: false)
  - `processed_at` (timestamp with time zone)
  - `error` (text)
  - `created_at` (timestamp with time zone, default: now())

### 32. `public.payment_providers`
- **Colunas:**
  - `id` (uuid, primary key)
  - `business_id` (uuid, foreign key referencing `businesses.id`)
  - `provider_name` (text)
  - `client_id` (text)
  - `client_secret` (text)
  - `webhook_secret` (text)
  - `configuration` (jsonb, default: '{}')
  - `is_active` (boolean, default: true)
  - `created_at` (timestamp with time zone, default: now())
  - `updated_at` (timestamp with time zone, default: now())

### 33. `public.audit_logs`
- **Colunas:**
  - `id` (uuid, primary key)
  - `business_id` (uuid, foreign key referencing `businesses.id`)
  - `table_name` (text)
  - `operation` (text) // 'INSERT', 'UPDATE', 'DELETE'
  - `record_id` (text)
  - `old_data` (jsonb)
  - `new_data` (jsonb)
  - `user_id` (uuid, foreign key referencing `auth.users.id`)
  - `created_at` (timestamp with time zone, default: now())

### 34. `public.notifications`
- **Colunas:**
  - `id` (uuid, primary key)
  - `business_id` (uuid, foreign key referencing `businesses.id`)
  - `user_id` (uuid, foreign key referencing `auth.users.id`)
  - `title` (text)
  - `message` (text)
  - `type` (text) // 'appointment', 'payment', 'system'
  - `status` (text, default: 'unread') // 'unread', 'read'
  - `data` (jsonb)
  - `created_at` (timestamp with time zone, default: now())
  - `read_at` (timestamp with time zone)

### 35. `public.onboarding_progress`
- **Colunas:**
  - `id` (uuid, primary key)
  - `business_id` (uuid, foreign key referencing `businesses.id`)
  - `step` (text) // 'welcome', 'business', 'services', 'professionals', etc.
  - `completed` (boolean, default: false)
  - `data` (jsonb)
  - `completed_at` (timestamp with time zone)
  - `created_at` (timestamp with time zone, default: now())
  - `updated_at` (timestamp with time zone, default: now())

### 36. `public.business_analysis`
- **Colunas:**
  - `id` (uuid, primary key)
  - `business_id` (uuid, foreign key referencing `businesses.id`)
  - `date` (date)
  - `total_appointments` (integer, default: 0)
  - `completed_appointments` (integer, default: 0)
  - `cancellation_rate` (float, default: 0)
  - `occupancy_rate` (float, default: 0)
  - `total_revenue` (float, default: 0)
  - `total_expenses` (float, default: 0)
  - `net_profit` (float, default: 0)
  - `new_clients` (integer, default: 0)
  - `returning_clients` (integer, default: 0)
  - `average_service_time` (integer, default: 0)
  - `nps_score` (float, default: 0)
  - `popular_services` (jsonb, default: '{}')
  - `top_professionals` (jsonb, default: '{}')
  - `created_at` (timestamp with time zone, default: now())

### 37. `public.waitlist`
- **Colunas:**
  - `id` (uuid, primary key)
  - `business_id` (uuid, foreign key referencing `businesses.id`)
  - `client_id` (uuid, foreign key referencing `clients.id`)
  - `service_id` (uuid, foreign key referencing `services.id`)
  - `preferred_date` (date)
  - `notes` (text)
  - `created_at` (timestamp with time zone, default: now())

## Políticas de Segurança (RLS)

### 1. `auth.users`
- **Política:** `users_isolation`
  - **Condição:** `auth.uid() = id`
  - **Propósito:** Garante que usuários só possam acessar seus próprios dados.

### 2. `public.profiles`
- **Política:** `profiles_isolation`
  - **Condição:** `auth.uid() = user_id`
  - **Propósito:** Garante que usuários só possam acessar seus próprios perfis.

### 3. `public.businesses`
- **Política:** `businesses_isolation`
  - **Condição:** `auth.uid() IN (SELECT user_id FROM business_users WHERE business_id = id)`
  - **Propósito:** Garante que usuários só possam acessar dados de negócios aos quais pertencem.

### 4. `public.business_users`
- **Política:** `business_users_isolation`
  - **Condição:** `auth.uid() = user_id`
  - **Propósito:** Garante que usuários só possam acessar suas próprias associações com negócios.

### 5. `public.permissions`
- **Política:** `permissions_isolation`
  - **Condição:** `auth.uid() = user_id`
  - **Propósito:** Garante que usuários só possam acessar suas próprias permissões.

### 6. `public.professionals`
- **Política:** `professionals_isolation`
  - **Condição:** `business_id IN (SELECT business_id FROM business_users WHERE user_id = auth.uid())`
  - **Propósito:** Garante que usuários só possam acessar dados de profissionais do mesmo negócio.

### 7. `public.clients`
- **Política:** `clients_isolation`
  - **Condição:** `business_id IN (SELECT business_id FROM business_users WHERE user_id = auth.uid())`
  - **Propósito:** Garante que usuários só possam acessar dados de clientes do mesmo negócio.

### 8. `public.service_categories`
- **Política:** `service_categories_isolation`
  - **Condição:** `business_id IN (SELECT business_id FROM business_users WHERE user_id = auth.uid())`
  - **Propósito:** Garante que usuários só possam acessar dados de categorias de serviços do mesmo negócio.

### 9. `public.services`
- **Política:** `services_isolation`
  - **Condição:** `business_id IN (SELECT business_id FROM business_users WHERE user_id = auth.uid())`
  - **Propósito:** Garante que usuários só possam acessar dados de serviços do mesmo negócio.

### 10. `public.professional_services`
- **Política:** `professional_services_isolation`
  - **Condição:** `professional_id IN (SELECT id FROM professionals WHERE business_id IN (SELECT business_id FROM business_users WHERE user_id = auth.uid()))`
  - **Propósito:** Garante que usuários só possam acessar dados de serviços de profissionais do mesmo negócio.

### 11. `public.appointments`
- **Política:** `appointments_isolation`
  - **Condição:** `business_id IN (SELECT business_id FROM business_users WHERE user_id = auth.uid())`
  - **Propósito:** Garante que usuários só possam acessar dados de agendamentos do mesmo negócio.

### 12. `public.appointment_services`
- **Política:** `appointment_services_isolation`
  - **Condição:** `appointment_id IN (SELECT id FROM appointments WHERE business_id IN (SELECT business_id FROM business_users WHERE user_id = auth.uid()))`
  - **Propósito:** Garante que usuários só possam acessar dados de serviços de agendamentos do mesmo negócio.

### 13. `public.availabilities`
- **Política:** `availabilities_isolation`
  - **Condição:** `business_id IN (SELECT business_id FROM business_users WHERE user_id = auth.uid())`
  - **Propósito:** Garante que usuários só possam acessar dados de disponibilidades do mesmo negócio.

### 14. `public.products`
- **Política:** `products_isolation`
  - **Condição:** `business_id IN (SELECT business_id FROM business_users WHERE user_id = auth.uid())`
  - **Propósito:** Garante que usuários só possam acessar dados de produtos do mesmo negócio.

### 15. `public.service_products`
- **Política:** `service_products_isolation`
  - **Condição:** `service_id IN (SELECT id FROM services WHERE business_id IN (SELECT business_id FROM business_users WHERE user_id = auth.uid()))`
  - **Propósito:** Garante que usuários só possam acessar dados de produtos de serviços do mesmo negócio.

### 16. `public.stock_items`
- **Política:** `stock_items_isolation`
  - **Condição:** `business_id IN (SELECT business_id FROM business_users WHERE user_id = auth.uid())`
  - **Propósito:** Garante que usuários só possam acessar dados de itens de estoque do mesmo negócio.

### 17. `public.stock_movements`
- **Política:** `stock_movements_isolation`
  - **Condição:** `business_id IN (SELECT business_id FROM business_users WHERE user_id = auth.uid())`
  - **Propósito:** Garante que usuários só possam acessar dados de movimentações de estoque do mesmo negócio.

### 18. `public.inventory_items`
- **Política:** `inventory_items_isolation`
  - **Condição:** `business_id IN (SELECT business_id FROM business_users WHERE user_id = auth.uid())`
  - **Propósito:** Garante que usuários só possam acessar dados de itens de inventário do mesmo negócio.

### 19. `public.financial_accounts`
- **Política:** `financial_accounts_isolation`
  - **Condição:** `business_id IN (SELECT business_id FROM business_users WHERE user_id = auth.uid())`
  - **Propósito:** Garante que usuários só possam acessar dados de contas financeiras do mesmo negócio.

### 20. `public.financial_categories`
- **Política:** `financial_categories_isolation`
  - **Condição:** `business_id IN (SELECT business_id FROM business_users WHERE user_id = auth.uid())`
  - **Propósito:** Garante que usuários só possam acessar dados de categorias financeiras do mesmo negócio.

### 21. `public.transactions`
- **Política:** `transactions_isolation`
  - **Condição:** `business_id IN (SELECT business_id FROM business_users WHERE user_id = auth.uid())`
  - **Propósito:** Garante que usuários só possam acessar dados de transações do mesmo negócio.

### 22. `public.commissions`
- **Política:** `commissions_isolation`
  - **Condição:** `professional_id IN (SELECT id FROM professionals WHERE business_id IN (SELECT business_id FROM business_users WHERE user_id = auth.uid()))`
  - **Propósito:** Garante que usuários só possam acessar dados de comissões de profissionais do mesmo negócio.

### 23. `public.loyalty_programs`
- **Política:** `loyalty_programs_isolation`
  - **Condição:** `business_id IN (SELECT business_id FROM business_users WHERE user_id = auth.uid())`
  - **Propósito:** Garante que usuários só possam acessar dados de programas de fidelidade do mesmo negócio.

### 24. `public.loyalty_levels`
- **Política:** `loyalty_levels_isolation`
  - **Condição:** `loyalty_program_id IN (SELECT id FROM loyalty_programs WHERE business_id IN (SELECT business_id FROM business_users WHERE user_id = auth.uid()))`
  - **Propósito:** Garante que usuários só possam acessar dados de níveis de fidelidade do mesmo negócio.

### 25. `public.loyalty_rules`
- **Política:** `loyalty_rules_isolation`
  - **Condição:** `loyalty_program_id IN (SELECT id FROM loyalty_programs WHERE business_id IN (SELECT business_id FROM business_users WHERE user_id = auth.uid()))`
  - **Propósito:** Garante que usuários só possam acessar dados de regras de fidelidade do mesmo negócio.

### 26. `public.loyalty_cards`
- **Política:** `loyalty_cards_isolation`
  - **Condição:** `loyalty_program_id IN (SELECT id FROM loyalty_programs WHERE business_id IN (SELECT business_id FROM business_users WHERE user_id = auth.uid()))`
  - **Propósito:** Garante que usuários só possam acessar dados de cartões de fidelidade do mesmo negócio.

### 27. `public.loyalty_transactions`
- **Política:** `loyalty_transactions_isolation`
  - **Condição:** `loyalty_card_id IN (SELECT id FROM loyalty_cards WHERE loyalty_program_id IN (SELECT id FROM loyalty_programs WHERE business_id IN (SELECT business_id FROM business_users WHERE user_id = auth.uid())))`
  - **Propósito:** Garante que usuários só possam acessar dados de transações de fidelidade do mesmo negócio.

### 28. `public.marketing_consents`
- **Política:** `marketing_consents_isolation`
  - **Condição:** `customer_id IN (SELECT id FROM clients WHERE business_id IN (SELECT business_id FROM business_users WHERE user_id = auth.uid()))`
  - **Propósito:** Garante que usuários só possam acessar dados de consentimentos de marketing do mesmo negócio.

### 29. `public.business_settings`
- **Política:** `business_settings_isolation`
  - **Condição:** `business_id IN (SELECT business_id FROM business_users WHERE user_id = auth.uid())`
  - **Propósito:** Garante que usuários só possam acessar dados de configurações do mesmo negócio.

### 30. `public.integrations`
- **Política:** `integrations_isolation`
  - **Condição:** `business_id IN (SELECT business_id FROM business_users WHERE user_id = auth.uid())`
  - **Propósito:** Garante que usuários só possam acessar dados de integrações do mesmo negócio.

### 31. `public.webhook_events`
- **Política:** `webhook_events_isolation`
  - **Condição:** `business_id IN (SELECT business_id FROM business_users WHERE user_id = auth.uid())`
  - **Propósito:** Garante que usuários só possam acessar dados de eventos de webhook do mesmo negócio.

### 32. `public.payment_providers`
- **Política:** `payment_providers_isolation`
  - **Condição:** `business_id IN (SELECT business_id FROM business_users WHERE user_id = auth.uid())`
  - **Propósito:** Garante que usuários só possam acessar dados de provedores de pagamento do mesmo negócio.

### 33. `public.audit_logs`
- **Política:** `audit_logs_isolation`
  - **Condição:** `business_id IN (SELECT business_id FROM business_users WHERE user_id = auth.uid())`
  - **Propósito:** Garante que usuários só possam acessar dados de logs de auditoria do mesmo negócio.

### 34. `public.notifications`
- **Política:** `notifications_isolation`
  - **Condição:** `business_id IN (SELECT business_id FROM business_users WHERE user_id = auth.uid())`
  - **Propósito:** Garante que usuários só possam acessar dados de notificações do mesmo negócio.

### 35. `public.onboarding_progress`
- **Política:** `onboarding_progress_isolation`
  - **Condição:** `business_id IN (SELECT business_id FROM business_users WHERE user_id = auth.uid())`
  - **Propósito:** Garante que usuários só possam acessar dados de progresso de onboarding do mesmo negócio.

### 36. `public.business_analysis`
- **Política:** `business_analysis_isolation`
  - **Condição:** `business_id IN (SELECT business_id FROM business_users WHERE user_id = auth.uid())`
  - **Propósito:** Garante que usuários só possam acessar dados de análise de negócio do mesmo negócio.

### 37. `public.waitlist`
- **Política:** `waitlist_isolation`
  - **Condição:** `business_id IN (SELECT business_id FROM business_users WHERE user_id = auth.uid())`
  - **Propósito:** Garante que usuários só possam acessar dados da lista de espera do mesmo negócio.

## APIs

### 1. `get_tenant_data`
- **Endpoint:** `/api/tenant-data`
- **Método:** GET
- **Propósito:** Retorna dados do tenant atual, incluindo informações de usuários, negócios e passos de onboarding.

### 2. `update_onboarding_step`
- **Endpoint:** `/api/onboarding-step`
- **Método:** PUT
- **Propósito:** Atualiza o status de um passo de onboarding para um tenant.

## Edge Functions

### 1. `sync_tenant_data`
- **Função:** Sincroniza dados do tenant com o frontend, garantindo que as informações estejam sempre atualizadas.
- **Propósito:** Evita inconsistências entre o backend e o frontend, garantindo que os dados persistam corretamente.

### 2. `validate_tenant_access`
- **Função:** Valida o acesso do usuário ao tenant, garantindo que apenas usuários autorizados possam acessar os dados.
- **Propósito:** Reforça a segurança do sistema, evitando acessos não autorizados.

## Stored Procedures

### 1. `calculate_commission`
- **Propósito:** Calcula a comissão de um agendamento e registra o valor na tabela `commissions`.
- **Parâmetros:** `p_appointment_id` (uuid)

## Conclusão

Este schema e infraestrutura foram projetados para garantir que o backend se comunique efetivamente com o frontend, resolvendo problemas de inconsistência de dados, segurança e escalabilidade. As políticas de segurança (RLS) garantem que os dados sejam isolados por tenant, enquanto as APIs e edge functions facilitam a comunicação e a validação de dados entre o backend e o frontend. 