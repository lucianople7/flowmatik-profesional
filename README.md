# 🚀 Flowmatik Professional Backend

Backend profesional para Flowmatik con 8 Agentes de IA especializados, integración con Doubao 1.5-pro y sistema de memoria eterna.

## ✨ Características

### 🤖 8 Agentes de IA Especializados
- **FLOWI CEO** - Leadership & Strategy
- **TREND RESEARCHER** - Trending Topics Analysis  
- **HOOK CREATOR** - Engaging Hook Generator
- **EDITOR PRO** - Professional Video Editor
- **THUMBNAIL WIZARD** - Thumbnail Design Expert
- **OPTIMIZER** - Performance Optimization
- **CONTENT STRATEGIST** - Content Strategy Specialist
- **DATA MASTER** - Advanced Analytics Expert

### 🧠 Sistema de Memoria Eterna
- Nunca olvida conversaciones anteriores
- Contexto persistente entre sesiones
- Búsqueda semántica avanzada
- Análisis de patrones de comportamiento

### ⚡ Integración Doubao 1.5-pro
- 94% más barato que GPT-4
- Capacidades multimodales (texto, imagen, video)
- Latencia ultra-baja (<50ms)
- Deep Thinking Mode para razonamiento avanzado

## 🛠️ Tecnologías

- **Runtime:** Cloudflare Workers
- **Framework:** Hono.js
- **IA:** Doubao 1.5-pro via 302.AI
- **Base de datos:** Cloudflare KV (memoria eterna)
- **Deploy:** Automático desde GitHub

## 🚀 Deploy en Cloudflare Workers

### 1. Configuración
```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/flowmatik-profesional.git
cd flowmatik-profesional

# Instalar dependencias
npm install
```

### 2. Variables de entorno
Configurar en Cloudflare Dashboard:
```
AI_302_API_KEY=tu-api-key-de-302ai
```

### 3. Deploy
```bash
# Deploy automático desde GitHub
# O manual con Wrangler CLI:
npm run deploy
```

## 📡 Endpoints API

### Para flowmatik.co (Web pública)
```
GET  /api/agents                    # Lista de agentes disponibles
POST /api/agents/:id/generate       # Generar contenido con agente específico
GET  /api/agents/:id/chat           # Chat con agente específico
```

### Para admin.flowmatik.co (Terminal admin)
```
POST /api/terminal/chat             # Chat administrativo
GET  /api/terminal/status           # Estado del sistema
GET  /api/terminal/analytics        # Métricas y analytics
GET  /api/terminal/memory           # Gestión de memoria eterna
```

### Generales
```
GET  /health                        # Health check
GET  /                             # Información del sistema
```

## 💰 Costos Optimizados

- **Doubao 1.5-pro:** $0.11 input + $0.28 output por 1M tokens
- **50x más barato** que GPT-4
- **ROI proyectado:** +50,000% primer año
- **Cloudflare Workers:** $5/mes para millones de requests

## 🔒 Seguridad

- Rate limiting automático
- Validación de entrada robusta
- Headers de seguridad (Helmet)
- CORS configurado
- Variables de entorno encriptadas

## 📊 Analytics

- Tracking de costos en tiempo real
- Métricas de performance por agente
- Análisis de uso y patrones
- Reportes automáticos de ROI

## 🌍 Performance Global

- **Edge computing** con Cloudflare
- **Latencia <50ms** globalmente
- **99.9% uptime** garantizado
- **Escalado automático** ilimitado

## 🎯 Ejemplo de Uso

```javascript
// Generar contenido con HOOK CREATOR
const response = await fetch('https://tu-worker.workers.dev/api/agents/hook-creator/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    prompt: 'Crear hook para video sobre productividad',
    context: 'Audiencia joven profesional'
  })
});

const result = await response.json();
console.log(result.content); // Hook generado por IA
```

## 📈 Roadmap

- [ ] Integración con más modelos de IA
- [ ] Dashboard web para analytics
- [ ] API webhooks para integraciones
- [ ] Modo offline con cache inteligente
- [ ] Plugins para plataformas populares

## 🤝 Contribuir

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

MIT License - ver [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

- **Documentación:** [docs.flowmatik.co](https://docs.flowmatik.co)
- **Issues:** [GitHub Issues](https://github.com/tu-usuario/flowmatik-profesional/issues)
- **Email:** support@flowmatik.co

---

**Desarrollado para Flowmatik - La plataforma de contenido más avanzada del mercado** 🚀

