import { useEffect, useState } from "react";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import {
  getMyPswProfileRequest,
  upsertMyPswProfileRequest,
  uploadCertificationRequest,
} from "../services/pswProfileService";
import useAuth from "../hooks/useAuth";

function ProfileEditPage() {
  const { user } = useAuth();
  const isPsw = user?.role === "psw";
  const [status, setStatus] = useState("");
  const [profile, setProfile] = useState({
    name: user?.name || "",
    skills: "",
    experienceYears: "0",
    hourlyRate: "",
    bio: "",
    availabilityJson: "[]",
  });

  useEffect(() => {
    if (!isPsw) {
      return;
    }

    const load = async () => {
      const data = await getMyPswProfileRequest();
      if (!data) {
        return;
      }
      setProfile((prev) => ({
        ...prev,
        skills: (data.skills || []).join(", "),
        experienceYears: String(data.experienceYears || 0),
        hourlyRate: String(data.hourlyRate || ""),
        bio: data.bio || "",
        availabilityJson: JSON.stringify(data.availability || [], null, 2),
      }));
    };

    load();
  }, [isPsw]);

  const save = async (event) => {
    event.preventDefault();
    if (!isPsw) {
      setStatus(
        "Profile details for clients will be added in next API iteration.",
      );
      return;
    }

    await upsertMyPswProfileRequest({
      bio: profile.bio,
      skills: profile.skills
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      experienceYears: Number(profile.experienceYears || 0),
      hourlyRate: Number(profile.hourlyRate),
      availability: JSON.parse(profile.availabilityJson || "[]"),
    });

    setStatus("Profile updated successfully.");
  };

  const upload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    await uploadCertificationRequest(file);
    setStatus("Certification uploaded successfully.");
  };

  return (
    <section className="space-y-6">
      <Card>
        <h1>Profile Settings</h1>
        <p className="mt-2 text-sm text-slate-600">
          Update personal information, skills, and billing details.
        </p>
      </Card>

      <form className="space-y-4" onSubmit={save}>
        <Card>
          <h3>Personal Info</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Input
              id="name"
              label="Name"
              value={profile.name}
              onChange={(event) =>
                setProfile((prev) => ({ ...prev, name: event.target.value }))
              }
            />
            {isPsw ? (
              <Input
                id="experienceYears"
                label="Experience (years)"
                type="number"
                min="0"
                max="60"
                value={profile.experienceYears}
                onChange={(event) =>
                  setProfile((prev) => ({
                    ...prev,
                    experienceYears: event.target.value,
                  }))
                }
              />
            ) : null}
            {isPsw ? (
              <Input
                id="hourlyRate"
                label="Hourly Rate"
                type="number"
                value={profile.hourlyRate}
                onChange={(event) =>
                  setProfile((prev) => ({
                    ...prev,
                    hourlyRate: event.target.value,
                  }))
                }
              />
            ) : null}
          </div>
        </Card>

        {isPsw ? (
          <>
            <Card>
              <h3>Skills</h3>
              <p className="mt-1 text-sm text-slate-600">
                Comma-separated skills list.
              </p>
              <textarea
                className="ui-input mt-3 min-h-24"
                value={profile.skills}
                onChange={(event) =>
                  setProfile((prev) => ({
                    ...prev,
                    skills: event.target.value,
                  }))
                }
              />
            </Card>

            <Card>
              <h3>Certifications</h3>
              <input
                type="file"
                className="mt-3"
                onChange={upload}
                accept="application/pdf,image/jpeg,image/png"
              />
            </Card>
          </>
        ) : null}

        <Button type="submit">Save Changes</Button>
      </form>

      {status ? <p className="text-sm text-green-700">{status}</p> : null}
    </section>
  );
}

export default ProfileEditPage;
