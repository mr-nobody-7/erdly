import type { Node, Edge } from "@xyflow/react"
import type { TableField } from "@/components/diagram/table-node"

export interface SchemaValidationError {
  type: "error" | "warning"
  message: string
  nodeId?: string
  fieldId?: string
}

export interface ParsedSchema {
  tables: Array<{
    id: string
    name: string
    fields: TableField[]
  }>
  relationships: Array<{
    from: string
    to: string
    type: "1-1" | "1-n" | "n-n"
  }>
}

export function parseSchema(nodes: Node[], edges: Edge[]): ParsedSchema {
  const tables = nodes
    .filter((node) => node.type === "table")
    .map((node) => ({
      id: node.id,
      name: node.data.label,
      fields: node.data.fields || [],
    }))

  const relationships = edges.map((edge) => ({
    from: edge.source,
    to: edge.target,
    type: (edge.data?.relationType as "1-1" | "1-n" | "n-n") || "1-n",
  }))

  return { tables, relationships }
}

export function validateSchema(nodes: Node[], edges: Edge[]): SchemaValidationError[] {
  const errors: SchemaValidationError[] = []

  // Check for tables without primary keys
  nodes.forEach((node) => {
    if (node.type === "table") {
      const fields = node.data.fields || []
      const hasPrimaryKey = fields.some((f: TableField) => f.isPrimaryKey)

      if (!hasPrimaryKey && fields.length > 0) {
        errors.push({
          type: "warning",
          message: `Table "${node.data.label}" has no primary key`,
          nodeId: node.id,
        })
      }

      // Check for duplicate field names
      const fieldNames = fields.map((f: TableField) => f.name.toLowerCase())
      const duplicates = fieldNames.filter((name, index) => fieldNames.indexOf(name) !== index)

      if (duplicates.length > 0) {
        errors.push({
          type: "error",
          message: `Table "${node.data.label}" has duplicate field names: ${duplicates.join(", ")}`,
          nodeId: node.id,
        })
      }
    }
  })

  // Check for orphaned foreign keys
  edges.forEach((edge) => {
    const sourceNode = nodes.find((n) => n.id === edge.source)
    const targetNode = nodes.find((n) => n.id === edge.target)

    if (!sourceNode || !targetNode) {
      errors.push({
        type: "error",
        message: "Relationship references non-existent table",
      })
    }
  })

  console.log("[v0] Schema validation complete:", errors.length, "issues found")
  return errors
}

export function generateTableName(existingNames: string[]): string {
  let counter = 1
  let name = `table_${counter}`

  while (existingNames.includes(name)) {
    counter++
    name = `table_${counter}`
  }

  return name
}
