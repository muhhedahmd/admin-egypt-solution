import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const activities = [
  {
    id: 1,
    user: "John Doe",
    action: "created a new project",
    target: "E-commerce Platform",
    time: "2 hours ago",
    initials: "JD",
  },
  {
    id: 2,
    user: "Sarah Smith",
    action: "published a blog post",
    target: "AI in Modern Development",
    time: "4 hours ago",
    initials: "SS",
  },
  {
    id: 3,
    user: "Mike Johnson",
    action: "updated service",
    target: "Web Development",
    time: "6 hours ago",
    initials: "MJ",
  },
  {
    id: 4,
    user: "Emily Brown",
    action: "added team member",
    target: "Alex Wilson",
    time: "1 day ago",
    initials: "EB",
  },
  {
    id: 5,
    user: "David Lee",
    action: "responded to contact",
    target: "New inquiry from Acme Corp",
    time: "2 days ago",
    initials: "DL",
  },
]

export function RecentActivity() {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">{activity.initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm">
              <span className="font-medium">{activity.user}</span>{" "}
              <span className="text-muted-foreground">{activity.action}</span>{" "}
              <span className="font-medium">{activity.target}</span>
            </p>
            <p className="text-xs text-muted-foreground">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
