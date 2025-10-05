INSERT INTO public.roles (name, description, permissions, is_system) VALUES
('admin', 'مدير النظام', '{"all": true}', true),
('accountant', 'محاسب', '{"accounting": true, "reports": true, "customers": true, "suppliers": true}', true),
('sales', 'مبيعات', '{"sales": true, "customers": true, "products": true}', true),
('inventory', 'مخزون', '{"inventory": true, "products": true, "purchases": true}', true),
('user', 'مستخدم عادي', '{"dashboard": true}', true)
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.accounts (code, name, type) VALUES
('1000', 'الأصول', 'asset'),
('1100', 'الأصول المتداولة', 'asset'),
('1110', 'النقدية', 'asset'),
('1120', 'البنوك', 'asset'),
('1130', 'العملاء', 'asset'),
('1140', 'المخزون', 'asset'),
('2000', 'الخصوم', 'liability'),
('2100', 'الخصوم المتداولة', 'liability'),
('2110', 'الموردين', 'liability'),
('2120', 'الضرائب المستحقة', 'liability'),
('3000', 'حقوق الملكية', 'equity'),
('3100', 'رأس المال', 'equity'),
('3200', 'الأرباح المحتجزة', 'equity'),
('4000', 'الإيرادات', 'revenue'),
('4100', 'إيرادات المبيعات', 'revenue'),
('4200', 'إيرادات أخرى', 'revenue'),
('5000', 'المصروفات', 'expense'),
('5100', 'تكلفة البضاعة المباعة', 'expense'),
('5200', 'مصروفات التشغيل', 'expense'),
('5300', 'مصروفات إدارية', 'expense')
ON CONFLICT (code) DO NOTHING;

UPDATE public.accounts SET parent_id = (
  SELECT id FROM public.accounts WHERE code = '1000'
) WHERE code = '1100';

UPDATE public.accounts SET parent_id = (
  SELECT id FROM public.accounts WHERE code = '1100'
) WHERE code IN ('1110', '1120', '1130', '1140');

UPDATE public.accounts SET parent_id = (
  SELECT id FROM public.accounts WHERE code = '2000'
) WHERE code = '2100';

UPDATE public.accounts SET parent_id = (
  SELECT id FROM public.accounts WHERE code = '2100'
) WHERE code IN ('2110', '2120');

UPDATE public.accounts SET parent_id = (
  SELECT id FROM public.accounts WHERE code = '3000'
) WHERE code IN ('3100', '3200');

UPDATE public.accounts SET parent_id = (
  SELECT id FROM public.accounts WHERE code = '4000'
) WHERE code IN ('4100', '4200');

UPDATE public.accounts SET parent_id = (
  SELECT id FROM public.accounts WHERE code = '5000'
) WHERE code IN ('5100', '5200', '5300');