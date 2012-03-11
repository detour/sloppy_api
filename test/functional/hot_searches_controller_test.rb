require 'test_helper'

class HotSearchesControllerTest < ActionController::TestCase
  setup do
    @hot_search = hot_searches(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:hot_searches)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create hot_search" do
    assert_difference('HotSearch.count') do
      post :create, :hot_search => @hot_search.attributes
    end

    assert_redirected_to hot_search_path(assigns(:hot_search))
  end

  test "should show hot_search" do
    get :show, :id => @hot_search.to_param
    assert_response :success
  end

  test "should get edit" do
    get :edit, :id => @hot_search.to_param
    assert_response :success
  end

  test "should update hot_search" do
    put :update, :id => @hot_search.to_param, :hot_search => @hot_search.attributes
    assert_redirected_to hot_search_path(assigns(:hot_search))
  end

  test "should destroy hot_search" do
    assert_difference('HotSearch.count', -1) do
      delete :destroy, :id => @hot_search.to_param
    end

    assert_redirected_to hot_searches_path
  end
end
