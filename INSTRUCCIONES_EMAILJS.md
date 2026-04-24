# Configuración de EmailJS para Kura Estética

## Pasos para configurar EmailJS (gratuito y sencillo):

### 1. Crear cuenta en EmailJS
- Ve a https://www.emailjs.com/
- Regístrate con tu email: info@kuraestetica.com
- Elige el plan gratuito (200 emails/mes)

### 2. Configurar Servicio de Email
- En el dashboard, ve a "Email Services"
- Click "Add New Service"
- Elige "Gmail" (recomendado)
- Conecta tu cuenta de Gmail
- Nombra el servicio: `service_kura`

### 3. Crear Template de Email
- Ve a "Email Templates"
- Click "Create New Template"
- Configura así:

**Template ID:** `template_contacto`

**Asunto:** `Nuevo contacto de {{nombre}} - {{servicio}}`

**Contenido del email:**
```
Hola equipo de Kura Estética,

Has recibido un nuevo mensaje de contacto:

📝 DATOS DEL CLIENTE:
Nombre: {{nombre}}
Email: {{email}}
Teléfono: {{telefono}} (si lo agregas)
Servicio de interés: {{servicio}}

💬 MENSAJE:
{{mensaje}}

📅 Fecha de contacto: {{fecha}}
🌐 Página de origen: {{pagina}}

Por favor contactar a este cliente a la brevedad posible.

---
Enviado desde el formulario web de Kura Estética
```

### 4. Obtener tu Public Key
- Ve a "Account" → "API Keys"
- Copia tu "Public Key"

### 5. Actualizar el código
En el archivo `main.js`, reemplaza estas líneas:

```javascript
const EMAILJS_SERVICE_ID = 'service_kura'; // ← ya está correcto
const EMAILJS_TEMPLATE_ID = 'template_contacto'; // ← ya está correcto  
const EMAILJS_PUBLIC_KEY = 'TU_PUBLIC_KEY'; // ← reemplaza con tu key real
```

### 6. Probar el formulario
- Abre tu sitio web
- Llena el formulario de contacto
- Deberías recibir el email en info@kuraestetica.com

## Ventajas de EmailJS:
✅ Gratis (200 emails/mes)
✅ No requiere backend
✅ Fácil configuración
✅ Emails profesionales
✅ Integración directa con Gmail
✅ Panel de control para ver envíos

## Si necesitas ayuda:
- Documentación: https://www.emailjs.com/docs/
- Soporte: tienen chat en su web

## Campos disponibles en el template:
- {{nombre}} - Nombre del cliente
- {{email}} - Email del cliente  
- {{servicio}} - Tipo de servicio
- {{mensaje}} - Mensaje del cliente
- {{fecha}} - Fecha y hora
- {{pagina}} - Página donde se envió
- {{to_email}} - Email destinatario
