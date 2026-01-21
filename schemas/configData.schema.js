export default {
  type: "object",
  required: ["configs", "tenants"],
  properties: {
    tenants: {
      type: "array",
      items: { type: "string" }
    },
    configs: {
      type: "array",
      items: {
        type: "object",
        required: ["fatherCode", "code", "type", "value"],
        properties: {
          fatherCode: { type: "string" },
          code: { type: "string" },
          name: { type: "string" },
          type: { type: "string" },
          value: { type: "string" }
        }
      }
    }
  }
};