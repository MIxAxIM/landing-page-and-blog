import { CheckIcon } from "@heroicons/react/20/solid";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import React from "react";
import { api } from "~/utils/api";
import classNames from "~/utils/classnames";
import { cn } from "~/utils/shadcn";

const tiers = [
  {
    name: "Free Tier",
    id: "tier-free",
    href: "#",
    email: "hello@andamio.io",
    priceMonthly: "$0",
    description: "The essentials to get you started with Andamio.",
    features: [
      "Access to one onboarding course",
      "One integrated onboarding and contribution manager",
      "Basic project management tools",
      "Decentralized treasury management for small projects",
    ],
    transactionFee: "10% on top of network fees",
    mostPopular: false,
    productId: "prod_RDafDXa5UAS3qc",
  },
  {
    name: "Pro Tier",
    id: "tier-pro",
    href: "#",
    email: "hello@andamio.io",
    priceMonthly: "$95",
    description: "A comprehensive plan for growing organizations.",
    features: [
      "All Free Tier functionalities",
      "Access to more courses and contribution managers",
      "Enhanced onboarding tools",
      "Detailed project tracking",
      "Support for larger projects",
    ],
    transactionFee: "5% on top of network fees",
    mostPopular: true,
    productId: "prod_RDahmK3MGgGUV6",
  },
  {
    name: "Enterprise Tier",
    id: "tier-enterprise",
    href: "#",
    email: "hello@andamio.io",
    priceMonthly: "$995",
    description: "Designed for organizations with high transaction volumes.",
    features: [
      "Unlimited access to all features",
      "Advanced analytics",
      "Priority support",
      "Custom solutions for large organizations",
    ],
    transactionFee: "2.5% on top of network fees",
    mostPopular: false,
    productId: "prod_RDaj5nCmijjqVh",
  },
  {
    name: "Partner Tier",
    id: "tier-partner",
    href: "#",
    email: "hello@andamio.io",
    priceMonthly: "",
    description: (
      <div className="space-y-3">
        <p>
          Do you have a partnership idea that can benefit from onboarding and
          contribution support?
        </p>
        <p>
          Are you a Catalyst Proposer looking to use Andamio as part of your
          proposal?
        </p>
        <p>
          Do you have special needs that might not fit a monthly subscription
          model?
        </p>
        <p>We are open to partnerships and exploring how we can collaborate.</p>
        <p>
          <strong>Contact us now!</strong>
        </p>
      </div>
    ),
    mostPopular: false,
    isPartner: true, // New property to conditionally style this tier
  },
];

export function Pricing() {

  const { data: stripeSubscription } = api.billing.getPlans.useQuery()

  const { mutateAsync: initializeSubcription } = api.billing.createCheckoutSession.useMutation()

  const handleClick = async (priceId: string) => {
    try {
      const { url } = await initializeSubcription({
        priceId: priceId,
        successUrl: `${window.location.origin}/dashboard/subscription/success`,
        cancelUrl: `${window.location.origin}/cancel`,
      })
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      alert(error)
    }
  }


  return (
    <div className="py-24 sm:pt-48">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">
            Pricing
          </h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-primary sm:text-5xl">
            Pricing plans for organizations of all sizes
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-700">
          Find the right plan that fits your organization’s needs, from getting
          started to scaling up and beyond.
        </p>
        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-4">
          {tiers.map((tier, tierIdx) => {
            const subscription = stripeSubscription?.find(s => s.id === tier.productId)
            return (

              <div
                key={tier.id}
                className={classNames(
                  tier.mostPopular ? "lg:z-10 lg:rounded-b-none" : "lg:mt-8",
                  tierIdx === 0 ? "lg:rounded-r-none" : "",
                  tierIdx === tiers.length - 1 ? "lg:rounded-l-none" : "",
                  tierIdx < tiers.length - 1 && tierIdx > 0
                    ? "lg:rounded-none"
                    : "",
                  "flex flex-col justify-between rounded-3xl p-8 shadow-lg ring-1",
                  tier.isPartner
                    ? "bg-blue-50 text-gray-900 ring-blue-300"
                    : "bg-white text-gray-900 ring-gray-300", // Custom styling for Partner Tier
                )}
              >
                <div>
                  <div className="flex items-center justify-between gap-x-4">
                    <h3
                      id={tier.id}
                      className={classNames(
                        tier.mostPopular ? "text-primary" : "text-gray-900",
                        "text-lg font-semibold leading-8",
                      )}
                    >
                      {tier.name}
                    </h3>
                    {tier.mostPopular ? (
                      <p className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold leading-5 text-primary">
                        Most popular
                      </p>
                    ) : null}
                  </div>
                  {/* Conditional rendering for Partner Tier description */}
                  {tier.isPartner ? (
                    <div className="mt-4 text-sm leading-6 text-gray-700">
                      {tier.description}
                    </div>
                  ) : (
                    <p className="mt-4 text-sm leading-6 text-gray-600">
                      {tier.description}
                    </p>
                  )}
                  {/* Only render transaction fee if it exists */}
                  {tier.transactionFee && (
                    <p className="mt-2 text-sm text-gray-500">
                      Transaction Fee: {tier.transactionFee}
                    </p>
                  )}
                  {/* Only render features list if it exists */}
                  {tier.features && (
                    <ul
                      role="list"
                      className="mt-8 space-y-3 text-sm leading-6 text-gray-700"
                    >
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex gap-x-3">
                          <CheckIcon
                            className="h-6 w-5 flex-none text-primary"
                            aria-hidden="true"
                          />
                          {feature}
                        </li>
                      ))}
                      {subscription && (
                        <>
                          <li className="flex gap-x-3">
                            <CheckIcon
                              className="h-6 w-5 flex-none text-primary"
                              aria-hidden="true"
                            />
                            {subscription?.maxAllowedCourses} courses

                          </li>
                          <li className="flex gap-x-3">
                            <CheckIcon
                              className="h-6 w-5 flex-none text-primary"
                              aria-hidden="true"
                            />
                            {subscription?.maxAllowedTreasuries} treasuries

                          </li>
                        </>
                      )}
                    </ul>
                  )}
                </div>
                {/* Contact button with customized styling for Partner Tier */}
                {!!subscription ? (
                  <>

                    {subscription?.prices.map((p) => (
                      <PricingButton key={p.id} onClick={() => handleClick(p.id)} variant={tier.mostPopular ? "popular" : "partner"}>
                        {(p.unitAmount / 100n).toString()}{" "}{p.currency}/{p.interval}
                      </PricingButton>
                    ))}
                  </>

                ) : (
                  <PricingButton email={tier.email} subject={`Inquiry about ${tier.name}`} variant={tier.mostPopular ? "popular" : "partner"}>
                    Get in touch
                  </PricingButton>

                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}


const pricingButtonVariants = cva(
  "mt-8 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary hover:cursor-pointer",
  {
    variants: {
      variant: {
        default: "text-primary ring-1 ring-inset ring-primary hover:ring-primary",
        popular: "hover:bg-primary-dark bg-primary text-white shadow-sm",
        partner: "text-gray-900 ring-1 ring-inset ring-blue-900 hover:bg-blue-100",
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

type BasePricingButtonProps = {
  variant?: VariantProps<typeof pricingButtonVariants>["variant"];
  className?: string;
  asChild?: boolean;
  children?: React.ReactNode;
};

type EmailButtonProps = BasePricingButtonProps & {
  email: string;
  subject: string;
  onClick?: never;
};

type ClickButtonProps = BasePricingButtonProps & {
  onClick: () => void;
  email?: never;
  subject?: never;
};

export type PricingButtonProps = EmailButtonProps | ClickButtonProps;

const PricingButton = React.forwardRef<HTMLAnchorElement, PricingButtonProps>(
  ({ className, variant, email, subject, onClick, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "a";

    const href = email ? `mailto:${email}?subject=${encodeURIComponent(subject || '')}` : undefined;

    return (
      <Comp
        ref={ref}
        href={href}
        onClick={onClick}
        className={cn(pricingButtonVariants({ variant, className }))}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

PricingButton.displayName = "PricingButton";
