import { useNavigate } from 'react-router-dom'
import { HeadingField, CardLayout, RichTextDisplayField, ButtonWidget } from '@pglevy/sailwind'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="container mx-auto px-8 py-8">
        <HeadingField
          text="Skills-First Starter UI"
          size="LARGE"
          headingTag="H1"
          marginBelow="MORE"
        />

        <CardLayout padding="MORE" showShadow={true}>
          <HeadingField
            text="Welcome"
            size="MEDIUM"
            headingTag="H2"
            marginBelow="STANDARD"
          />

          <RichTextDisplayField
            value={[
              "This is a starter template for building UIs with Sailwind components.",
              "",
              "The UI integrates with your Skills-First backend through the API layer.",
              "All components use the Aurora color palette and SAIL-like parameter conventions."
            ]}
            marginBelow="MORE"
          />

          <HeadingField
            text="Example Pages"
            size="MEDIUM"
            headingTag="H3"
            marginBelow="STANDARD"
          />

          <div className="space-y-3">
            <ButtonWidget
              label="View Example Form"
              style="SOLID"
              color="ACCENT"
              onClick={() => navigate('/example-form')}
            />
          </div>
        </CardLayout>

        <div className="mt-6">
          <CardLayout padding="MORE" showShadow={true}>
            <HeadingField
              text="Next Steps"
              size="MEDIUM"
              headingTag="H3"
              marginBelow="STANDARD"
            />

            <RichTextDisplayField
              value={[
                "1. Update api.ts with your domain types and endpoints",
                "2. Create pages in src/pages/ using Sailwind components",
                "3. Add routes to App.tsx",
                "4. Connect forms and actions to your skills backend",
                "5. Run npm run build to validate before deployment"
              ]}
            />
          </CardLayout>
        </div>
      </div>
    </div>
  )
}
