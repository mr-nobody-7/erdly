"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit2, Trash2 } from "lucide-react"

export interface TableField {
  id: string
  name: string
  type: string
  isPrimaryKey: boolean
  isForeignKey: boolean
  isNullable?: boolean
}

export interface TableNodeData {
  label: string
  fields: TableField[]
  onEditTable?: () => void
  onDeleteTable?: () => void
}

function TableNode({ data, selected }: NodeProps<TableNodeData>) {
  return (
    <Card
      className={`min-w-[250px] transition-all duration-200 hover:shadow-xl ${
        selected ? "ring-2 ring-primary shadow-lg shadow-primary/20" : ""
      }`}
    >
      <CardHeader className="p-3 pb-2 bg-primary/5 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">{data.label}</h3>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 hover:bg-primary/10"
              onClick={(e) => {
                e.stopPropagation()
                data.onEditTable?.()
              }}
            >
              <Edit2 className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 hover:bg-destructive/10"
              onClick={(e) => {
                e.stopPropagation()
                data.onDeleteTable?.()
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {data.fields.length === 0 ? (
          <div className="p-3 text-xs text-muted-foreground text-center">No fields yet. Click edit to add fields.</div>
        ) : (
          <div className="divide-y">
            {data.fields.map((field) => (
              <div key={field.id} className="p-2 hover:bg-muted/50 transition-colors flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium truncate">{field.name}</span>
                    <div className="flex gap-1">
                      {field.isPrimaryKey && (
                        <Badge variant="default" className="h-4 px-1 text-[10px]">
                          PK
                        </Badge>
                      )}
                      {field.isForeignKey && (
                        <Badge variant="secondary" className="h-4 px-1 text-[10px]">
                          FK
                        </Badge>
                      )}
                      {field.isNullable && (
                        <Badge variant="outline" className="h-4 px-1 text-[10px]">
                          NULL
                        </Badge>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{field.type}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <Handle type="target" position={Position.Top} className="!bg-primary !w-3 !h-3 !border-2 !border-background" />
      <Handle type="source" position={Position.Bottom} className="!bg-primary !w-3 !h-3 !border-2 !border-background" />
    </Card>
  )
}

export default memo(TableNode)
