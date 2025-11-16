"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Check, Loader2 } from "lucide-react"
import { mockApi, type SubscriptionPlan } from "@/lib/mock-api"
import { toast } from "sonner"

export default function BillingPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [availablePlans, currentSubscription] = await Promise.all([
          mockApi.getPlans(),
          mockApi.getSubscriptionPlan(),
        ])
        setPlans(availablePlans)
        setCurrentPlan(currentSubscription)
      } catch (error) {
        toast.error("Failed to load billing information")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleUpgrade = async (planName: "free" | "pro" | "enterprise", displayName: string) => {
    setUpgrading(planName)
    try {
      const newPlan = await mockApi.updateSubscription(planName)
      setCurrentPlan(newPlan)
      toast.success(`Successfully upgraded to ${displayName} plan!`, {
        description: "Your new features are now available.",
      })
    } catch (error) {
      toast.error("Failed to upgrade plan", {
        description: "Please try again later.",
      })
    } finally {
      setUpgrading(null)
    }
  }

  if (loading) {
    return (
      <div className="p-8 space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-9 w-56" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-12 w-32" />
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((j) => (
                    <Skeleton key={j} className="h-4 w-full" />
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing & Plans</h1>
        <p className="text-muted-foreground">Manage your subscription and billing information</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const isCurrent = currentPlan?.name === plan.name
          const isUpgrading = upgrading === plan.name
          const displayName = plan.name.charAt(0).toUpperCase() + plan.name.slice(1)

          return (
            <Card
              key={plan.id}
              className={`transition-all duration-200 hover:shadow-lg ${isCurrent ? "border-primary ring-2 ring-primary/20" : ""}`}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {displayName}
                  {isCurrent && (
                    <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded animate-in fade-in">
                      Current
                    </span>
                  )}
                </CardTitle>
                <CardDescription>
                  {plan.maxDiagrams === -1 ? "Unlimited diagrams" : `Up to ${plan.maxDiagrams} diagrams`}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={isCurrent ? "outline" : "default"}
                  disabled={isCurrent || isUpgrading}
                  onClick={() => handleUpgrade(plan.name, displayName)}
                >
                  {isUpgrading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Upgrading...
                    </>
                  ) : isCurrent ? (
                    "Current Plan"
                  ) : (
                    "Upgrade"
                  )}
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      {currentPlan && (
        <Card className="animate-in fade-in slide-in-from-bottom-4">
          <CardHeader>
            <CardTitle>Current Subscription</CardTitle>
            <CardDescription>Your active subscription details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Plan</p>
                <p className="font-medium capitalize">{currentPlan.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-medium capitalize">{currentPlan.status}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Billing Cycle</p>
                <p className="font-medium capitalize">{currentPlan.interval}ly</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Next Billing Date</p>
                <p className="font-medium">{new Date(currentPlan.currentPeriodEnd).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>Manage your payment information</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No payment method on file. Add a payment method to upgrade your plan.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="outline">Add Payment Method</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
