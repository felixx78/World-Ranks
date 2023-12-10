import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useNavigate } from "react-router-dom";
import { Country } from "../lib/definitions";
import CheckBox from "../components/CheckBox";
import SelectFilter from "../components/SelectFilter";

import searchButtonIcon from "../assets/Search.svg";

const fetchAllCountries = async () => {
  const response = await fetch("https://restcountries.com/v3.1/all");
  const data = await response.json();

  return data as Country[];
};

const CountriesPage = () => {
  const regions = ["Americas", "Africa", "Asia", "Europe"];

  const { data, isLoading: isReactQueryLoading } = useQuery({
    queryKey: ["contries"],
    queryFn: fetchAllCountries,
    initialData: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [countries, setCountries] = useState<Country[]>([]);

  const [searchState, setSearchState] = useState("");
  const [sortBy, setSortBy] = useState("Unsorted");
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState({
    unMember: false,
    independent: false,
  });

  useEffect(() => setIsLoading(isReactQueryLoading), [isReactQueryLoading]);

  useEffect(() => setCountries(data), [data]);

  const filterCountries = (searchFilter: string) => {
    let newCountries =
      selectedRegions.length === 0
        ? data.slice()
        : data
            .slice()
            .filter((country) => selectedRegions.includes(country.region));

    if (statusFilter.unMember)
      newCountries = newCountries.filter((country) => country.unMember);
    if (statusFilter.independent)
      newCountries = newCountries.filter((country) => country.independent);

    if (sortBy === "Population")
      newCountries.sort((a, b) => b.population - a.population);
    else if (sortBy === "Area") newCountries.sort((a, b) => b.area - a.area);
    else if (sortBy === "Name")
      newCountries.sort((a, b) => a.name.common.localeCompare(b.name.common));

    newCountries = newCountries.filter((country) =>
      country.name.common
        .toLocaleLowerCase()
        .startsWith(searchFilter.toLocaleLowerCase()),
    );

    return newCountries;
  };

  useEffect(() => {
    setIsLoading(true);

    const newCountries = filterCountries(searchState);
    setCountries(newCountries);

    setTimeout(() => setIsLoading(false), 1000);
  }, [sortBy, statusFilter, selectedRegions]);

  const toggleRegion = (region: string) => {
    setSelectedRegions((prev) => {
      if (selectedRegions.includes(region)) {
        return prev.filter((item) => item !== region);
      }

      return [...prev, region];
    });
  };

  const handleSearchOnChange = (filter: string) => {
    setSearchState(filter);
    const newCountries = filterCountries(filter);
    setCountries(newCountries);
  };

  return (
    <div className="h-full">
      <div className="flex flex-wrap justify-between gap-4 px-6 py-6">
        {isLoading ? (
          <Skeleton width={180} height={20} />
        ) : (
          <div className="text-[#6C727F]">
            Found {countries.length} countries
          </div>
        )}

        <SearchBar value={searchState} onChange={handleSearchOnChange} />
      </div>

      <div className="grid h-full grid-cols-6 gap-4">
        {/* Side Bar */}
        <div className="relative col-span-6 h-fit px-6 py-4 text-[#6C727F] md:col-span-2">
          {/* Loading overflow */}
          {isLoading && (
            <div className="absolute left-0 top-0 z-30 h-full w-screen opacity-40 md:w-full">
              <Skeleton style={{ height: "100%" }} />
            </div>
          )}

          <div className="mb-8">
            <div className="mb-2 text-[14px]">Sort by</div>
            <SelectFilter
              selectedFilter={sortBy}
              onChange={(filter: string) => {
                setSortBy(filter);
              }}
            />
          </div>

          <div className="mb-8">
            <div className="mb-2 text-[14px]">Region</div>
            <div className="flex flex-wrap gap-4">
              {regions.map((region) => (
                <button
                  className={`rounded-lg px-4 py-2 ${
                    selectedRegions.includes(region)
                      ? "bg-[#282B30] text-[#D2D5DA]"
                      : ""
                  }`}
                  key={region}
                  onClick={() => toggleRegion(region)}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 text-[14px]">Status</div>
            <div className="flex flex-col gap-4">
              <CheckBox
                label="Member of the United Union"
                onChange={() => {
                  setStatusFilter((prev) => ({
                    ...prev,
                    unMember: !prev.unMember,
                  }));
                }}
              />
              <CheckBox
                label="Independent"
                onChange={() => {
                  setStatusFilter((prev) => ({
                    ...prev,
                    independent: !prev.independent,
                  }));
                }}
              />
            </div>
          </div>
        </div>

        <div className="col-span-6 px-2 md:col-span-4">
          <Table countries={countries} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

const SearchBar = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (filter: string) => void;
}) => {
  return (
    <div className="relative w-full sm:max-w-[300px]">
      <img
        width={35}
        src={searchButtonIcon}
        alt=""
        className="absolute h-full px-1"
      />
      <input
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        className="h-[35px] w-full rounded-xl bg-[#282b30] pl-10 text-[#6C727F] placeholder:text-[#6C727F] focus:outline-none"
        placeholder="Search by Name"
        type="text"
      />
    </div>
  );
};

const Table = ({
  countries,
  isLoading,
}: {
  countries: Country[];
  isLoading: boolean;
}) => {
  const navigate = useNavigate();

  const TableRow = ({ country }: { country: Country }) => {
    return (
      <tr
        onClick={() => navigate(`/country/${country.name.common}`)}
        className="cursor-pointer"
      >
        <td width={100}>
          <img
            style={{ width: 60, height: 40 }}
            src={country.flags.svg}
            alt=""
          />
        </td>
        <td>{country.name.common}</td>
        <td width={160} className="hidden pr-10 sm2:table-cell">
          {country.population}
        </td>
        <td className="hidden sm:table-cell">{country.area}</td>
      </tr>
    );
  };

  const TableRowSkeleton = () => {
    return (
      <tr>
        <td width={100}>
          <Skeleton width={60} height={40} />
        </td>
        <td>
          <Skeleton width={150} height={15} />
        </td>
        <td width={160} className="hidden pr-10 sm2:table-cell">
          <Skeleton width={100} height={15} />
        </td>
        <td width={120} className="hidden pr-12 sm:table-cell">
          <Skeleton width={60} height={15} />
        </td>
      </tr>
    );
  };

  return (
    <table className="mx-auto w-full max-w-[1000px] border-separate border-spacing-y-4">
      <thead>
        <tr className=" border-b-4 border-[#282B3] text-[14px] text-[#6C727F]">
          <td>Flag</td>
          <td>Name</td>
          <td className="hidden sm2:table-cell">Population</td>
          <td className="hidden sm:table-cell">
            Area(km<span className="align-top text-[10px]">2</span>)
          </td>
        </tr>

        <tr className="bg-[#282B30]">
          <td colSpan={4}></td>
        </tr>
      </thead>

      <tbody>
        {isLoading
          ? Array.from({ length: 12 }, (_, i) => i + 1).map((i) => (
              <TableRowSkeleton key={i} />
            ))
          : countries.map((country) => (
              <TableRow key={country.name.common} country={country} />
            ))}
      </tbody>
    </table>
  );
};

export default CountriesPage;
