import {
  faAngleLeft,
  faAngleRight,
  faArrowUpRightFromSquare,
  faCaretDown,
  faCaretUp,
  faEllipsisVertical,
  faFilter,
  faMagnifyingGlass,
  faMinus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../axios/axiosInstance";
import Label from "../../components/Label";
import SearchAndFilterPanel from "./components/SearchAndFilterPanel";
import UserCard from "./components/UserCard";
import { addUsers } from "../../store/action";
import { RootState } from "../../store/store";
import { User } from "../../types";
import styled from "styled-components";

const fetchUsers = async (): Promise<User[]> => {
  const response = await axiosInstance.get("/users");
  return response.data;
};

function List() {
  const mode = useSelector((state: RootState) => state.mode);

  const [users, setUsers] = useState<User[]>([]);
  const [pageData, setPageData] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [showItems, setShowItems] = useState<number>(5);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [filterData, setFilterData] = useState<string[]>([]);
  const [sortData, setSortData] = useState<{
    name: 0 | 1 | 2;
    email: 0 | 1 | 2;
  }>({ name: 1, email: 1 });

  const dispatch = useDispatch();
  const orgData = useSelector((state: RootState) => state.users);

  const { data, isLoading, error } = useQuery<User[], Error>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const getUsers = () => {
    const startIndex = (currentPage - 1) * showItems;
    const endIndex = startIndex + showItems;
    return users.slice(startIndex, endIndex);
  };

  const searchUsers = () => {
    const lowercasedQuery = searchQuery.toLowerCase();

    return orgData.filter(
      (user) =>
        user.name.toLowerCase().includes(lowercasedQuery) ||
        user.email.toLowerCase().includes(lowercasedQuery) ||
        user.company.name.toLowerCase().includes(lowercasedQuery)
    );
  };

  useEffect(() => {
    if (data && !orgData.length) {
      setUsers(data);
      setTotalPage(Math.ceil(data.length / showItems));
      setPageData(data);
      dispatch(addUsers(data));
    } else {
      setUsers(orgData);
      setTotalPage(Math.ceil(orgData.length / showItems));
      setPageData(orgData);
    }
  }, [data, orgData]);

  useEffect(() => {
    setTotalPage(Math.ceil(users.length / showItems));
    if (currentPage > Math.ceil(users.length / showItems)) {
      setCurrentPage(1);
    }
  }, [showItems]);

  useEffect(() => {
    const data = getUsers();
    setPageData(data);
  }, [currentPage, totalPage, showItems, users]);

  useEffect(() => {
    let filteredUser: User[] = [];

    // If searchQuery is present, perform the search
    if (searchQuery.trim()) {
      filteredUser = searchUsers();
    } else {
      // Use the original dataset when searchQuery is empty
      filteredUser = orgData; // Use orgData instead of users to reset to the original data
    }

    // If there are filter criteria in filterData, apply the filters
    if (filterData.length) {
      const newUsers = filteredUser.filter((user) => {
        return filterData.some((data) => {
          const cityMatch = user.address?.city
            ?.toLowerCase()
            .includes(data.toLowerCase());
          const companyMatch = user.company?.name
            ?.toLowerCase()
            .includes(data.toLowerCase());
          return cityMatch || companyMatch;
        });
      });

      // Ensure uniqueness based on user.id, and handle type of 'id'
      filteredUser = Array.from(
        new Set(newUsers.map((user) => user.id)) // Use user.id for uniqueness
      ).map((id) => {
        return newUsers.find((user) => user.id === id);
      }) as User[];
    }

    // Set the filtered users or revert to the original data
    if (
      filteredUser.length > 0 ||
      searchQuery.trim() ||
      filteredUser.length > 0
    ) {
      setUsers(filteredUser);
      setTotalPage(Math.ceil(filteredUser.length / showItems));
      if (currentPage > Math.ceil(filteredUser.length / showItems)) {
        setCurrentPage(1);
      }
    } else {
      setUsers(orgData);
      setTotalPage(Math.ceil(orgData.length / showItems));
      if (currentPage > Math.ceil(orgData.length / showItems)) {
        setCurrentPage(1);
      }
    }
  }, [searchQuery, filterData]);

  const changePage = (value: number) => {
    setCurrentPage(currentPage + value);
  };

  useEffect(() => {
    const filterCon = document.getElementById("filter-con");
    const filter = document.getElementById("filter");

    // Update filter container styles
    if (filterCon) {
      filterCon.style.visibility = filterOpen ? "visible" : "hidden";
      filterCon.style.opacity = filterOpen ? "1" : "0";
      filterCon.style.transform = filterOpen ? "scaleY(1)" : "scaleY(0)";
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterCon &&
        !filterCon.contains(event.target as Node) &&
        filter &&
        !filter.contains(event.target as Node)
      ) {
        setFilterOpen(false);
      }
    };

    if (filterOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [filterOpen]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setFilterData((prevFilterData) => {
      if (prevFilterData.includes(value)) {
        // If value is already in the array, remove it
        return prevFilterData.filter((item) => item !== value);
      } else {
        // If value is not in the array, add it
        return [...prevFilterData, value];
      }
    });
  };

  const toggleSort = (field: "name" | "email") => {
    setSortData((prevState) => ({
      ...prevState,
      [field]: prevState[field] === 2 ? 0 : prevState[field] + 1,
    }));
  };

  useEffect(() => {
    const sortUsers = () => {
      if (users.length) {
        let sortedUsers = [...users]; // Create a copy to avoid mutating the original array

        // Sort by name if needed
        if (sortData.name === 0) {
          sortedUsers.sort((a, b) => b.name.localeCompare(a.name)); // Descending
        } else if (sortData.name === 2) {
          sortedUsers.sort((a, b) => a.name.localeCompare(b.name)); // Ascending
        }

        // Sort by email if needed
        if (sortData.email === 0) {
          sortedUsers.sort((a, b) => b.email.localeCompare(a.email)); // Descending
        } else if (sortData.email === 2) {
          sortedUsers.sort((a, b) => a.email.localeCompare(b.email)); // Ascending
        }

        // Update the state
        setUsers(sortedUsers);
      }
    };

    sortUsers();
  }, [sortData]);

  if (isLoading) return <div>Loading...</div>;
  if (error instanceof Error) return <div>Error: {error.message}</div>;
  return (
    <Container>
      <SearchAndFilterPanel
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setShowItems={setShowItems}
        showItems={showItems}
        setFilterOpen={setFilterOpen}
        filterOpen={filterOpen}
        handleFilterChange={handleFilterChange}
        orgData={orgData}
        filterData={filterData}
      />
      <ListContent>
        <Header>
          <HeaderItem width={"22%"}>
            <Label sx={{ color: "gray" }}>Name</Label>
            <FontAwesomeIcon
              onClick={() => toggleSort("name")}
              icon={
                sortData.name === 0
                  ? faCaretDown
                  : sortData.name === 1
                  ? faMinus
                  : faCaretUp
              }
              style={{
                marginLeft: "auto",
                color:
                  sortData.name === 0
                    ? "red"
                    : sortData.name === 1
                    ? "gray"
                    : "green",
                cursor: "pointer",
              }}
            />
          </HeaderItem>
          <HeaderItem width={"23%"}>
            <Label sx={{ color: "gray" }}>Email</Label>
            <FontAwesomeIcon
              onClick={() => toggleSort("email")}
              icon={
                sortData.email === 0
                  ? faCaretDown
                  : sortData.email === 1
                  ? faMinus
                  : faCaretUp
              }
              style={{
                marginLeft: "auto",
                color:
                  sortData.email === 0
                    ? "red"
                    : sortData.email === 1
                    ? "gray"
                    : "green",
                cursor: "pointer",
              }}
            />
          </HeaderItem>
          <Label sx={{ color: "gray", width: "34%" }}>Address</Label>
          <Label sx={{ color: "gray", width: "18%" }}>Company</Label>
        </Header>
        {pageData.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </ListContent>
      <Footer>
        <PaginationContainer>
          <PaginationButton
            onClick={() => changePage(-1)}
            style={{
              pointerEvents: currentPage <= 1 ? "none" : "auto",
              borderRight: `3px solid ${mode === 'light' ? '#d2d3db' : '#252526'}`,
            }}
          >
            <FontAwesomeIcon icon={faAngleLeft} />
            {currentPage <= 1 && (
              <Label>
                {currentPage} OF {totalPage}
              </Label>
            )}
          </PaginationButton>
          <PaginationButton
            onClick={() => changePage(1)}
            style={{ pointerEvents: currentPage < totalPage ? "auto" : "none" }}
          >
            {currentPage > 1 && (
              <Label>
                {currentPage} OF {totalPage}
              </Label>
            )}
            <FontAwesomeIcon icon={faAngleRight} />
          </PaginationButton>
        </PaginationContainer>
      </Footer>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ListContent = styled.div`
  width: 85%;
  min-height: 76%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding-bottom: 50px;
  overflow-y: scroll;
`;

const Header = styled.div`
  width: 100%;
  padding: 0.5rem 0;
  display: flex;
  align-items: center;
`;

const HeaderItem = styled.div<{ width: string }>`
  width: ${(props) => props.width};
  display: flex;
  align-items: center;
  padding-right: 1rem;
  box-sizing: border-box;
`;

const Footer = styled.div`
  width: 85%;
  height: 9%;
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 3rem;
`;

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  color: ${(p) => p.theme.font};
  border-radius: 20px;
  overflow: hidden;
  background-color: ${(p) => p.theme.secondary};
  box-shadow: ${(p) => p.theme.shadow};
`;

const PaginationButton = styled.div`
padding: 0.3rem 1rem;
cursor: pointer;
display: flex;
align-items: center;
gap: 1rem;
`;

export default List;
