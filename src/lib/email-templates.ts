
export const getNewsletterWelcomeEmail = (unsubLink: string = '#') => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Bienvenida a Unhada</title>
</head>
<body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #F3F0E7; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #2F3E34; font-family: 'Georgia', serif; font-size: 32px; letter-spacing: -0.5px; margin: 0;">Unhada<span style="color: #B87333;">.life</span></h1>
      <p style="color: #4A5D4E; font-size: 14px; letter-spacing: 2px; text-transform: uppercase;">Magia & Biohacking</p>
    </div>

    <!-- Card -->
    <div style="background-color: #ffffff; padding: 40px; border-radius: 16px; box-shadow: 0 4px 12px rgba(74, 93, 78, 0.05); border: 1px solid rgba(74, 93, 78, 0.1);">
      <h2 style="color: #2F3E34; font-family: 'Georgia', serif; font-size: 24px; margin-top: 0; text-align: center;">¡Bienvenida al Círculo! ✨</h2>
      
      <p style="color: #4A5D4E; line-height: 1.6; font-size: 16px;">
        Gracias por unirte a nuestra comunidad. Estás a un paso de redescubrir tu magia interior a través de la naturaleza y la ciencia.
      </p>
      
      <p style="color: #4A5D4E; line-height: 1.6; font-size: 16px;">
        Aquí recibirás:
      </p>
      
      <ul style="color: #4A5D4E; line-height: 1.6; font-size: 16px; padding-left: 20px;">
        <li style="margin-bottom: 10px;">Tips de biohacking para tu ciclo.</li>
        <li style="margin-bottom: 10px;">Rituales alineados con los astros.</li>
        <li style="margin-bottom: 10px;">Acceso anticipado a nuevos grimorios.</li>
      </ul>

      <div style="text-align: center; margin-top: 30px;">
        <a href="https://unhada.life" style="display: inline-block; background-color: #B87333; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 50px; font-weight: bold; font-size: 16px; letter-spacing: 0.5px;">Explorar el Bosque</a>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 40px;">
      <p style="color: #4A5D4E; opacity: 0.6; font-size: 12px;">
        Con amor, Ariane.<br>
        © ${new Date().getFullYear()} Unhada.life
      </p>
      <div style="margin-top: 20px;">
        <a href="#" style="color: #4A5D4E; text-decoration: none; font-size: 12px; margin: 0 10px; opacity: 0.8;">Instagram</a>
        <a href="#" style="color: #4A5D4E; text-decoration: none; font-size: 12px; margin: 0 10px; opacity: 0.8;">Tiktok</a>
      </div>
    </div>

  </div>
</body>
</html>
`;

export const getFreeDownloadEmail = (productName: string, downloadLink: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Tu Regalo de Unhada</title>
</head>
<body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #F3F0E7; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #2F3E34; font-family: 'Georgia', serif; font-size: 28px; letter-spacing: -0.5px; margin: 0;">Unhada<span style="color: #B87333;">.life</span></h1>
    </div>

    <!-- Card -->
    <div style="background-color: #ffffff; padding: 40px; border-radius: 16px; box-shadow: 0 4px 12px rgba(74, 93, 78, 0.05); border: 1px solid rgba(74, 93, 78, 0.1); text-align: center;">
      
      <h2 style="color: #2F3E34; font-family: 'Georgia', serif; font-size: 24px; margin-top: 0;">¡Aquí tienes tu Magia! 🌙</h2>
      
      <p style="color: #4A5D4E; line-height: 1.6; font-size: 16px; margin-bottom: 30px;">
        Gracias por descargar <strong>${productName}</strong>. Este recurso ha sido diseñado con mucho amor para acompañarte en tu camino.
      </p>

      <div style="background-color: #F3F0E7; border-radius: 12px; padding: 20px; margin-bottom: 30px; display: inline-block; width: 80%;">
         <img src="https://placehold.co/100x100/D8D0E3/6B5B95?text=PDF" alt="PDF Icon" style="width: 64px; height: 64px; margin-bottom: 10px; border-radius: 8px;">
         <p style="margin: 0; color: #2F3E34; font-weight: bold;">${productName}</p>
         <p style="margin: 5px 0 0; color: #4A5D4E; font-size: 14px;">Formato PDF • Descarga Inmediata</p>
      </div>
      
      <div>
        <a href="${downloadLink}" style="display: inline-block; background-color: #B87333; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 50px; font-weight: bold; font-size: 16px; letter-spacing: 0.5px; box-shadow: 0 4px 6px rgba(184, 115, 51, 0.2);">Descargar Ahora</a>
      </div>

      <p style="margin-top: 30px; font-size: 12px; color: #4A5D4E; opacity: 0.8;">
        Si el botón no funciona, copia este enlace: <br/>
        <a href="${downloadLink}" style="color: #B87333;">${downloadLink}</a>
      </p>

    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 40px;">
      <p style="color: #4A5D4E; opacity: 0.6; font-size: 12px;">
        Con amor, Ariane.<br>
        Disfruta tu regalo ✨
      </p>
    </div>

  </div>
</body>
</html>
`;

export const getPurchaseReceiptEmail = (customerName: string, orderNumber: string, products: { name: string, link: string }[]) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Confirmación de Compra</title>
</head>
<body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #F3F0E7; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #2F3E34; font-family: 'Georgia', serif; font-size: 28px; letter-spacing: -0.5px; margin: 0;">Unhada<span style="color: #B87333;">.life</span></h1>
    </div>

    <!-- Card -->
    <div style="background-color: #ffffff; padding: 40px; border-radius: 16px; box-shadow: 0 4px 12px rgba(74, 93, 78, 0.05); border: 1px solid rgba(74, 93, 78, 0.1);">
      
      <div style="text-align: right; margin-bottom: 20px;">
        <span style="font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Orden #${orderNumber}</span>
      </div>

      <h2 style="color: #2F3E34; font-family: 'Georgia', serif; font-size: 24px; margin-top: 0; text-align: center;">¡Gracias por tu compra, ${customerName}! 🌙</h2>
      
      <p style="color: #4A5D4E; line-height: 1.6; font-size: 16px; text-align: center;">
        Tu pedido ha sido confirmado. Estamos felices de que hayas elegido invertir en tu magia.
      </p>
      
      <div style="margin-top: 30px; margin-bottom: 30px;">
        <h3 style="color: #B87333; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid rgba(184, 115, 51, 0.2); padding-bottom: 10px; margin-bottom: 20px;">Tus Descargas</h3>
        
        ${products.map(product => `
        <div style="display: flex; align-items: center; margin-bottom: 15px; padding: 15px; background-color: #F9F7F2; border-radius: 12px;">
           <div style="background-color: #D8D0E3; width: 40px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
              <span style="font-size: 20px;">🌙</span>
           </div>
           <div style="flex-grow: 1;">
              <p style="margin: 0; font-weight: bold; color: #2F3E34;">${product.name}</p>
              <a href="${product.link}" style="color: #B87333; font-size: 14px; text-decoration: none; font-weight: bold;">Descargar PDF →</a>
           </div>
        </div>
        `).join('')}
      </div>
      
      <div style="background-color: #E0F7FA; padding: 20px; border-radius: 12px; border: 1px solid rgba(70, 130, 180, 0.2);">
        <p style="margin: 0; color: #4682B4; font-size: 14px; line-height: 1.5;">
          <strong>Nota Importante:</strong> Guarda este correo. Los enlaces de descarga no caducan.
        </p>
      </div>

    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 40px;">
      <p style="color: #4A5D4E; opacity: 0.6; font-size: 12px;">
        ¿Tienes dudas? Responde a este correo.<br>
        © ${new Date().getFullYear()} Unhada.life
      </p>
    </div>

  </div>
</body>
</html>
`;
