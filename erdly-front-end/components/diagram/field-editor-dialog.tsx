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
import type { TableField } from "./table-node"

interface FieldEditorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  field?: TableField
  onSave: (field: Omit<TableField, "id"> & { id?: string }) => void
}

const DATA_TYPES = ["VARCHAR", "TEXT", "INTEGER", "BIGINT", "DECIMAL", "BOOLEAN", "DATE", "TIMESTAMP", "JSON", "UUID"]

export function FieldEditorDialog({ open, onOpenChange, field, onSave }: FieldEditorDialogProps) {
  const [name, setName] = useState("")
  const [type, setType] = useState("VARCHAR")
  const [isPrimaryKey, setIsPrimaryKey] = useState(false)
  const [isForeignKey, setIsForeignKey] = useState(false)
  const [isNullable, setIsNullable] = useState(false)

  useEffect(() => {
    if (field) {
      setName(field.name)
      setType(field.type)
      setIsPrimaryKey(field.isPrimaryKey)
      setIsForeignKey(field.isForeignKey)
      setIsNullable(field.isNullable || false)
    } else {
      setName("")
      setType("VARCHAR")
      setIsPrimaryKey(false)
      setIsForeignKey(false)
      setIsNullable(false)
    }
  }, [field, open])

  const handleSave = () => {
    if (!name.trim()) return

    onSave({
      id: field?.id,
      name: name.trim(),
      type,
      isPrimaryKey,
      isForeignKey,
      isNullable,
    })

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{field ? "Edit Field" : "Add Field"}</DialogTitle>
          <DialogDescription>
            {field ? "Update the field properties below." : "Add a new field to the table."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="field-name">Field Name</Label>
            <Input
              id="field-name"
              placeholder="e.g., user_id, email, created_at"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && name.trim()) {
                  handleSave()
                }
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="field-type">Data Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="field-type">
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

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="primary-key"
                checked={isPrimaryKey}
                onCheckedChange={(checked) => setIsPrimaryKey(checked as boolean)}
              />
              <Label htmlFor="primary-key" className="text-sm font-normal cursor-pointer">
                Primary Key
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="foreign-key"
                checked={isForeignKey}
                onCheckedChange={(checked) => setIsForeignKey(checked as boolean)}
              />
              <Label htmlFor="foreign-key" className="text-sm font-normal cursor-pointer">
                Foreign Key
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="nullable"
                checked={isNullable}
                onCheckedChange={(checked) => setIsNullable(checked as boolean)}
              />
              <Label htmlFor="nullable" className="text-sm font-normal cursor-pointer">
                Nullable
              </Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            {field ? "Update" : "Add"} Field
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
