"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"
import type { TableField } from "./table-node"

interface TableEditorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tableName: string
  fields: TableField[]
  onSave: (tableName: string, fields: TableField[]) => void
}

const DATA_TYPES = ["VARCHAR", "TEXT", "INTEGER", "BIGINT", "DECIMAL", "BOOLEAN", "DATE", "TIMESTAMP", "JSON", "UUID"]

interface FieldRow extends TableField {
  isNew?: boolean
}

export function TableEditorDialog({ open, onOpenChange, tableName, fields, onSave }: TableEditorDialogProps) {
  const [editedTableName, setEditedTableName] = useState(tableName)
  const [editedFields, setEditedFields] = useState<FieldRow[]>([])

  useEffect(() => {
    if (open) {
      setEditedTableName(tableName)
      setEditedFields(fields.length > 0 ? [...fields] : [])
    }
  }, [open, tableName, fields])

  const handleAddField = () => {
    const newField: FieldRow = {
      id: `temp-${Date.now()}`,
      name: "",
      type: "VARCHAR",
      isPrimaryKey: false,
      isForeignKey: false,
      isNew: true,
    }
    setEditedFields([...editedFields, newField])
  }

  const handleUpdateField = (index: number, updates: Partial<FieldRow>) => {
    const newFields = [...editedFields]
    newFields[index] = { ...newFields[index], ...updates }
    setEditedFields(newFields)
  }

  const handleDeleteField = (index: number) => {
    setEditedFields(editedFields.filter((_, i) => i !== index))
  }

  const handleSave = () => {
    // Filter out empty fields and assign proper IDs to new fields
    const validFields = editedFields
      .filter((field) => field.name.trim() !== "")
      .map((field) => ({
        ...field,
        id: field.isNew ? `field-${Date.now()}-${Math.random()}` : field.id,
        isNew: undefined,
      })) as TableField[]

    onSave(editedTableName, validFields)
    onOpenChange(false)
  }

  const isValid = editedTableName.trim() !== ""

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Table</DialogTitle>
          <DialogDescription>Manage table name and all fields in one place.</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          {/* Table Name */}
          <div className="space-y-2">
            <Label htmlFor="table-name">Table Name</Label>
            <Input
              id="table-name"
              placeholder="e.g., users, products, orders"
              value={editedTableName}
              onChange={(e) => setEditedTableName(e.target.value)}
            />
          </div>

          {/* Fields Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Fields</Label>
              <Button variant="outline" size="sm" onClick={handleAddField}>
                <Plus className="h-4 w-4 mr-1" />
                Add Field
              </Button>
            </div>

            {editedFields.length === 0 ? (
              <div className="border rounded-lg p-8 text-center text-sm text-muted-foreground">
                No fields yet. Click "Add Field" to create one.
              </div>
            ) : (
              <div className="border rounded-lg divide-y">
                {editedFields.map((field, index) => (
                  <div key={field.id} className="p-3 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Field Name</Label>
                        <Input
                          placeholder="e.g., user_id, email"
                          value={field.name}
                          onChange={(e) => handleUpdateField(index, { name: e.target.value })}
                          className="h-8"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Data Type</Label>
                        <Select value={field.type} onValueChange={(value) => handleUpdateField(index, { type: value })}>
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {DATA_TYPES.map((dataType) => (
                              <SelectItem key={dataType} value={dataType}>
                                {dataType}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`pk-${field.id}`}
                            checked={field.isPrimaryKey}
                            onCheckedChange={(checked) =>
                              handleUpdateField(index, { isPrimaryKey: checked as boolean })
                            }
                          />
                          <Label htmlFor={`pk-${field.id}`} className="text-xs font-normal cursor-pointer">
                            Primary Key
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`fk-${field.id}`}
                            checked={field.isForeignKey}
                            onCheckedChange={(checked) =>
                              handleUpdateField(index, { isForeignKey: checked as boolean })
                            }
                          />
                          <Label htmlFor={`fk-${field.id}`} className="text-xs font-normal cursor-pointer">
                            Foreign Key
                          </Label>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteField(index)}
                        className="h-7 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isValid}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
