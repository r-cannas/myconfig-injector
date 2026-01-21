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
        required: ["code", "value"],
        properties: {
          applCode: { type: "string" },
          value: { type: "string" }
        }
      }
    }
  }
};