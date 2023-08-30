import { CaretLeft } from "phosphor-react-native";

import { Container, Logo, BackButton } from "./styles";
import logo from "../../../assets/logo.png";
import { useNavigation } from "@react-navigation/native";

type Props = {
  showBackButton?: boolean;
};

export function Header({ showBackButton = false }: Props) {
  const { navigate } = useNavigation();

  return (
    <Container>
      {showBackButton && (
        <BackButton onPress={() => navigate("Groups")}>
          <CaretLeft color="#FFF" size={32} />
        </BackButton>
      )}

      <Logo source={logo} />
    </Container>
  );
}
