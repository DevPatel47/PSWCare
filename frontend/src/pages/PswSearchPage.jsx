import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import { api } from "../services/api";

function PswSearchPage() {
  const [filters, setFilters] = useState({
    q: "",
    experience: "",
    skill: "",
    minRate: "",
    maxRate: "",
  });
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProfiles = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/psw-profiles/search", {
        params: {
          q: filters.q || undefined,
          experience: filters.experience || undefined,
          skill: filters.skill || undefined,
          minRate: filters.minRate || undefined,
          maxRate: filters.maxRate || undefined,
        },
      });
      setProfiles(response.data.data.profiles);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to fetch PSWs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  return (
    <section className="space-y-6">
      <Card>
        <h1>Search PSWs</h1>
        <p className="mt-2 text-sm text-slate-600">
          Search approved PSWs and filter by skills, experience, and rate.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Input
            id="q"
            name="q"
            label="Search"
            placeholder="Name or skill"
            value={filters.q}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, q: event.target.value }))
            }
          />
          <Input
            id="experience"
            name="experience"
            label="Minimum Experience (years)"
            type="number"
            placeholder="2"
            value={filters.experience}
            onChange={(event) =>
              setFilters((prev) => ({
                ...prev,
                experience: event.target.value,
              }))
            }
          />
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <Input
            id="skill"
            name="skill"
            label="Skill"
            placeholder="e.g. dementia-care"
            value={filters.skill}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, skill: event.target.value }))
            }
          />
          <Input
            id="minRate"
            name="minRate"
            type="number"
            label="Min hourly rate"
            value={filters.minRate}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, minRate: event.target.value }))
            }
          />
          <Input
            id="maxRate"
            name="maxRate"
            type="number"
            label="Max hourly rate"
            value={filters.maxRate}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, maxRate: event.target.value }))
            }
          />
        </div>
        <Button className="mt-5" onClick={fetchProfiles}>
          Search
        </Button>
      </Card>

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {loading ? <p className="text-sm text-slate-500">Loading...</p> : null}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {profiles.map((profile) => (
          <Card key={profile._id}>
            <div className="flex items-start justify-between">
              <div>
                <h3>{profile.user?.name}</h3>
                <p className="text-xs text-slate-500">
                  {profile.experienceYears || 0}+ years experience
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-slate-200" />
            </div>
            <p className="mt-3 line-clamp-3 text-sm text-slate-600">
              {profile.bio || "No bio provided."}
            </p>
            <p className="mt-3 text-sm font-semibold text-saas-primary">
              ${profile.hourlyRate}/hour
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {profile.skills?.slice(0, 4).map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
                >
                  {skill}
                </span>
              ))}
            </div>
            <Link
              to={`/psw/${profile.user?._id}`}
              className="mt-4 inline-block text-sm font-semibold text-saas-primary"
            >
              View profile
            </Link>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default PswSearchPage;
