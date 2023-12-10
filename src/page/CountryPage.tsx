import { useQuery } from "@tanstack/react-query";
import { Link, Navigate, useParams } from "react-router-dom";
import { Country } from "../lib/definitions";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";

const fetchCountry = async ({ queryKey }: { queryKey: string[] }) => {
  const [_, name] = queryKey;

  const response = await fetch(
    `https://restcountries.com/v3.1/name/${name}?fullText=true`,
  );
  const data = await response.json();

  return data as Country[];
};

const fetchBorderCountries = async (codes: string[]) => {
  const requests: Promise<Country>[] = [];

  for (const code of codes) {
    requests.push(
      new Promise(async (resolve) => {
        const response = await fetch(
          `https://restcountries.com/v3.1/alpha/${code}`,
        );

        const data = await response.json();

        resolve(data[0] as Country);
      }),
    );
  }

  return Promise.all(requests);
};

const CountryPage = () => {
  const { name } = useParams();

  if (!name) return <Navigate to="/404" />;

  const { data, isLoading } = useQuery({
    queryKey: ["country", name],
    queryFn: fetchCountry,
  });
  const [bordersCountries, setBordersCountries] = useState<Country[]>([]);
  const [isBordersCountriesLoading, setIsBordersCountriesLoading] =
    useState(true);

  useEffect(() => {
    setIsBordersCountriesLoading(true);
    (async () => {
      const borders = data?.[0]?.borders;

      if (borders) {
        const newBordersCountries = await fetchBorderCountries(borders);
        setBordersCountries(newBordersCountries);
      }
    })();
    setTimeout(() => setIsBordersCountriesLoading(false), 500);
  }, [data]);

  const country =
    data?.[0] ||
    ({
      languages: {},
      currencies: {},
      continents: [""],
      borders: ["", "", ""],
    } as Country);

  const countryDetails = [
    {
      label: "Capital",
      value: country.capital,
    },
    {
      label: "Subregion",
      value: country.subregion,
    },
    {
      label: "Languages",
      value: Object.values(country.languages),
    },
    {
      label: "Currencies",
      value: Object.values(country.currencies).map((currency) => currency.name),
    },
    {
      label: "Continent",
      value: country.continents[0],
    },
  ];

  return (
    <div className="sm:pb-12">
      <div className="mx-auto mt-[-40px] max-w-[800px] rounded-xl border-2 border-[#282b30] bg-[#1b1d1f] pb-16">
        <div className="mx-auto mb-6 mt-[-50px] max-w-[220px] sm:max-w-[300px]">
          {isLoading ? (
            <>
              <div className="hidden sm:block">
                <Skeleton width={300} height={200} />
              </div>

              {/* mobile skeleton */}
              <div className="block sm:hidden">
                <Skeleton width={220} height={140} />
              </div>
            </>
          ) : (
            <>
              <div className="hidden sm:block">
                <img
                  style={{ height: 200 }}
                  className="mx-auto"
                  src={country.flags.svg}
                  alt=""
                />
              </div>

              {/* mobile image */}
              <div className="block sm:hidden">
                <img
                  style={{ height: 140 }}
                  className="mx-auto"
                  src={country.flags.svg}
                  alt=""
                />
              </div>
            </>
          )}
        </div>

        <div className="mb-2 px-2 text-center text-4xl font-bold">
          {isLoading ? (
            <>
              <div className="hidden sm:block">
                <Skeleton width={200} />
              </div>

              {/* mobile skeleton */}
              <div className="block sm:hidden">
                <Skeleton width={120} />
              </div>
            </>
          ) : (
            country.name.common
          )}
        </div>

        <div className="mb-10 px-2 text-center text-xl">
          {isLoading ? (
            <>
              <div className="hidden sm:block">
                <Skeleton width={300} />
              </div>

              {/* mobile skeleton */}
              <div className="block sm:hidden">
                <Skeleton width={200} />
              </div>
            </>
          ) : (
            country.name.official
          )}
        </div>

        <div className="mb-10 flex flex-wrap justify-around gap-4 px-4">
          <div className="flex w-full justify-between divide-x-2 divide-[#1b1d1f] rounded-xl bg-[#282b30] sm:w-auto">
            <div className="w-[50%] px-6 py-4 sm:w-auto">Population</div>
            <div className="w-[50%] px-6 py-4 text-center sm:w-auto">
              {isLoading ? (
                <Skeleton width={80} height={20} />
              ) : (
                country.population
              )}
            </div>
          </div>

          <div className="flex w-full justify-between divide-x-2 divide-[#1b1d1f] rounded-xl bg-[#282b30] sm:w-auto">
            <div className="w-[50%] px-6 py-4 sm:w-auto">
              Area(km<span className="align-top text-sm">2</span>)
            </div>
            <div className="w-[50%] px-6 py-4 text-center sm:w-auto">
              {isLoading ? <Skeleton width={80} height={20} /> : country.area}
            </div>
          </div>
        </div>

        <div className="mb-8">
          {countryDetails.map((details, index) => (
            <div
              className={`flex justify-between gap-2 border-t-2 border-[#282b30] py-4 ${
                countryDetails.length - 1 === index ? "border-b-2" : ""
              }`}
              key={details.label}
            >
              <div className="self-center pl-4 text-[#6C727F]">
                {details.label}
              </div>

              <div className="pr-4 text-right">
                {isLoading ? (
                  <Skeleton width={120} />
                ) : typeof details.value === "string" ? (
                  <div>{details.value}</div>
                ) : (
                  <div>
                    {details.value.map((detail, index) =>
                      details.value.length - 1 === index
                        ? detail
                        : `${detail}, `,
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="px-4">
          {country?.borders && (
            <div className="mb-6 text-[#6C727F]">Neighbouring Countries</div>
          )}
          <div
            className="grid justify-items-center gap-4"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(7rem, 1fr))",
            }}
          >
            {country?.borders && (isBordersCountriesLoading || isLoading)
              ? Array.from(
                  { length: country.borders.length },
                  (_, i) => i + 1,
                ).map((i) => (
                  <div key={i}>
                    <Skeleton className="mb-2" height={80} width={120} />
                    <Skeleton width={120} />
                  </div>
                ))
              : bordersCountries.map((country) => (
                  <Link
                    to={`/country/${country.name.common}`}
                    className="block w-fit"
                    key={country.name.common}
                  >
                    <img
                      className="mx-auto mb-2 max-w-[120px]"
                      style={{ height: 80 }}
                      src={country.flags.svg}
                      alt=""
                    />
                    <div className="text-center">{country.name.common}</div>
                  </Link>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default CountryPage;
