# Gallimimus Framework

## Descripción
Esta biblioteca/framework proporciona una solución robusta y flexible para el desarrollo de aplicaciones. Diseñada con un enfoque en la modularidad y el rendimiento, ofrece herramientas que simplifican tareas complejas y mejoran la productividad del desarrollador.

## Características principales
- **Modularidad**: Arquitectura basada en componentes que facilita la reutilización de código
- **Alto rendimiento**: Optimizada para ejecutarse eficientemente incluso con cargas de trabajo intensivas
- **Extensibilidad**: Fácil de ampliar con plugins y módulos personalizados
- **Documentación completa**: Guías detalladas y ejemplos para facilitar el aprendizaje

## Instalación
```bash
deno add jsr:@booringsoftware/gallimimus
```

En el archivo deno.json, agreuga o modifica la siguiente línea para simplificar los imports:
```json
{
    "imports": {
        "@gallimimus": "jsr:@booringsoftware/gallimimus"
    }
}
```

## Routing

### Controladores

```typescript
import { Controller } from "@gallimimus";

@Controller()
class HelloWorldController {
    constructor() {}

    @Get("/")
    async index() {
        return "Hello, World!";
    }
}
```

## Arrancar el servidor
```typescript
import { Gallimimus } from "@gallimimus";
new Gallimimus().run();
```
